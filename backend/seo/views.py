from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SEOMetadata, Redirect
from .serializers import SEOMetadataSerializer, RedirectSerializer
from core.permissions import IsAdminUser
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator
from accounts.utils import log_action
from products.models import Product
from categories.models import Category
from django.db.models import Q
import os
from django.conf import settings

class RedirectViewSet(viewsets.ModelViewSet):
    queryset = Redirect.objects.all()
    serializer_class = RedirectSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        redirect = serializer.save()
        log_action(self.request.user, 'REDIRECT_CREATED', 'redirect', redirect.id, f"Created redirect: {redirect.source_path} -> {redirect.destination_path}", self.request)

    def perform_update(self, serializer):
        redirect = serializer.save()
        log_action(self.request.user, 'REDIRECT_UPDATED', 'redirect', redirect.id, f"Updated redirect: {redirect.source_path}", self.request)

    def perform_destroy(self, instance):
        redirect_id = instance.id
        source_path = instance.source_path
        instance.delete()
        log_action(self.request.user, 'REDIRECT_DELETED', 'redirect', redirect_id, f"Deleted redirect: {source_path}", self.request)

class SEOViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'])
    def get_metadata(self, request):
        model = request.query_params.get('model')
        object_id = request.query_params.get('object_id')

        if not model or not object_id:
            return Response({'error': 'model and object_id are required'}, status=400)

        try:
            content_type = ContentType.objects.get(model=model)
            meta = SEOMetadata.objects.filter(content_type=content_type, object_id=object_id).first()
            if meta:
                return Response(SEOMetadataSerializer(meta).data)
            return Response({})
        except ContentType.DoesNotExist:
            return Response({'error': 'Invalid model'}, status=400)

    @action(detail=False, methods=['post'])
    def update_metadata(self, request):
        model = request.data.get('model')
        object_id = request.data.get('object_id')
        data = request.data.get('metadata', {})

        if not model or not object_id:
            return Response({'error': 'model and object_id are required'}, status=400)

        try:
            content_type = ContentType.objects.get(model=model)
            meta, created = SEOMetadata.objects.get_or_create(
                content_type=content_type,
                object_id=object_id
            )
            serializer = SEOMetadataSerializer(meta, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                log_action(request.user, 'SEO_UPDATED', model, object_id, f"Updated SEO metadata for {model} {object_id}", request)
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except ContentType.DoesNotExist:
            return Response({'error': 'Invalid model'}, status=400)

    @action(detail=False, methods=['get'], url_path='health-check')
    def health_check(self, request):
        """Get SEO health metrics for all products and categories"""
        try:
            products_total = Product.objects.count()
            products_with_seo = SEOMetadata.objects.filter(
                content_type=ContentType.objects.get(model='product')
            ).count()
            
            categories_total = Category.objects.count()
            categories_with_seo = SEOMetadata.objects.filter(
                content_type=ContentType.objects.get(model='category')
            ).count()
            
            products_missing_desc = Product.objects.filter(Q(description__isnull=True) | Q(description='')).count()
            
            metrics = {
                'overall_score': 0,
                'products': {
                    'total': products_total,
                    'with_seo': products_with_seo,
                    'coverage_percent': (products_with_seo / max(products_total, 1)) * 100,
                    'missing_description': products_missing_desc,
                },
                'categories': {
                    'total': categories_total,
                    'with_seo': categories_with_seo,
                    'coverage_percent': (categories_with_seo / max(categories_total, 1)) * 100,
                },
                'redirects': {
                    'total': Redirect.objects.count(),
                    'active': Redirect.objects.filter(is_active=True).count(),
                },
            }
            
            # Calculate overall score
            total_coverage = (products_with_seo + categories_with_seo) / max(products_total + categories_total, 1)
            metrics['overall_score'] = int(total_coverage * 100)
            
            return Response(metrics)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='regenerate-sitemap')
    def regenerate_sitemap(self, request):
        """Regenerate sitemap.xml file"""
        try:
            from django.urls import reverse
            from django.utils.text import slugify
            
            sitemap_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''
            # Add products
            products = Product.objects.filter(status='active')
            for product in products:
                sitemap_content += f'''  <url>
    <loc>https://yoursite.com/products/{product.slug}/</loc>
    <lastmod>{product.updated_at.isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''
            
            # Add categories
            categories = Category.objects.all()
            for category in categories:
                sitemap_content += f'''  <url>
    <loc>https://yoursite.com/categories/{category.slug}/</loc>
    <lastmod>{category.updated_at.isoformat() if hasattr(category, 'updated_at') else '2024-01-01T00:00:00Z'}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
'''
            
            sitemap_content += '</urlset>'
            
            # Save to static directory
            sitemap_path = os.path.join(settings.STATIC_ROOT or 'static', 'sitemap.xml')
            os.makedirs(os.path.dirname(sitemap_path), exist_ok=True)
            
            with open(sitemap_path, 'w') as f:
                f.write(sitemap_content)
            
            log_action(request.user, 'SITEMAP_REGENERATED', 'seo', None, f"Regenerated sitemap with {products.count()} products and {categories.count()} categories", request)
            
            return Response({
                'message': 'Sitemap regenerated successfully',
                'products_included': products.count(),
                'categories_included': categories.count(),
                'sitemap_url': '/static/sitemap.xml'
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
