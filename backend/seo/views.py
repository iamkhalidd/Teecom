from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SEOMetadata, Redirect
from .serializers import SEOMetadataSerializer, RedirectSerializer
from core.permissions import IsAdminUser
from django.contrib.contenttypes.models import ContentType
from accounts.utils import log_action

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
