from decimal import Decimal
from django.db import transaction
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, ProductVariant, SpecialOffer, NewsletterSubscriber, InventoryMovement
from .serializers import (
    ProductSerializer, SpecialOfferSerializer, NewsletterSubscriberSerializer,
    InventoryMovementSerializer, ProductVariantSerializer
)
from core.permissions import IsAdminUser
from accounts.utils import log_action

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

    def perform_create(self, serializer):
        product = serializer.save()
        log_action(self.request.user, 'PRODUCT_CREATE', 'product', product.id, f"Created product: {product.name}", self.request)

    def perform_update(self, serializer):
        product = serializer.save()
        log_action(self.request.user, 'PRODUCT_UPDATE', 'product', product.id, f"Updated product: {product.name}", self.request)

    def perform_destroy(self, instance):
        log_action(self.request.user, 'PRODUCT_DELETE', 'product', instance.id, f"Deleted product: {instance.name}", self.request)
        instance.delete()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'bulk_update', 'bulk_delete']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]

    @action(detail=False, methods=['post'], url_path='bulk-update')
    def bulk_update(self, request):
        ids = request.data.get('ids', [])
        action = request.data.get('action')
        value = request.data.get('value')

        if not ids or not action:
            return Response({'error': 'ids and action are required'}, status=status.HTTP_400_BAD_REQUEST)

        products = Product.objects.filter(id__in=ids)

        with transaction.atomic():
            if action == 'status':
                products.update(status=value)
                log_action(request.user, 'PRODUCT_BULK_UPDATE', 'product', None, f"Bulk updated status to {value} for {products.count()} products", request)
            elif action == 'visibility':
                products.update(status=value) # Assuming visibility maps to status
                log_action(request.user, 'PRODUCT_BULK_UPDATE', 'product', None, f"Bulk updated visibility to {value} for {products.count()} products", request)
            elif action == 'category':
                from categories.models import Category
                try:
                    category = Category.objects.get(id=value)
                    products.update(category=category)
                    log_action(request.user, 'PRODUCT_BULK_UPDATE', 'product', None, f"Bulk updated category to {category.name} for {products.count()} products", request)
                except Category.DoesNotExist:
                    return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
            elif action == 'price_adjust':
                adjustment_type = request.data.get('adjustment_type', 'fixed')
                adjustment_value = float(value)
                for product in products:
                    if adjustment_type == 'fixed':
                        product.price += Decimal(str(adjustment_value))
                    elif adjustment_type == 'percentage':
                        product.price *= Decimal(str(1 + adjustment_value / 100))
                    product.save()
                log_action(request.user, 'PRODUCT_BULK_UPDATE', 'product', None, f"Bulk adjusted price by {adjustment_value} ({adjustment_type}) for {products.count()} products", request)
            elif action == 'archive':
                products.update(status='archived')
                log_action(request.user, 'PRODUCT_BULK_UPDATE', 'product', None, f"Bulk archived {products.count()} products", request)
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'bulk update successful', 'count': products.count()})

    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request):
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'error': 'ids are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Prefer archiving over deleting if not already archived
        count = Product.objects.filter(id__in=ids).update(status='archived')
        return Response({'status': 'products archived', 'count': count})

class SpecialOfferViewSet(viewsets.ModelViewSet):
    queryset = SpecialOffer.objects.all()
    serializer_class = SpecialOfferSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]

class InventoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InventoryMovement.objects.all().order_by('-created_at')
    serializer_class = InventoryMovementSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter]
    search_fields = ['product__name', 'reason']

    @action(detail=False, methods=['post'], url_path='adjust')
    def adjust_stock(self, request):
        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')
        quantity_change = request.data.get('quantity_change')
        reason = request.data.get('reason', 'Manual Adjustment')
        type = request.data.get('type', 'manual')

        if not product_id or quantity_change is None:
            return Response({'error': 'product_id and quantity_change are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity_change = int(quantity_change)
            product = Product.objects.get(id=product_id)

            if variant_id:
                variant = ProductVariant.objects.get(id=variant_id, product=product)
                previous_quantity = variant.stock_quantity
                new_quantity = previous_quantity + quantity_change

                # Mark as handled to avoid signal double-logging if we want custom log
                variant._inventory_movement_handled = True
                variant.stock_quantity = new_quantity
                variant.save()

                movement = InventoryMovement.objects.create(
                    product=product,
                    variant=variant,
                    type=type,
                    quantity_change=quantity_change,
                    previous_quantity=previous_quantity,
                    new_quantity=new_quantity,
                    reason=reason,
                    user=request.user
                )
                log_action(request.user, 'INVENTORY_ADJUSTED', 'product', product.id, f"Adjusted stock for {product.name} ({variant.size}/{variant.color}) by {quantity_change}", request)
                return Response(ProductVariantSerializer(variant).data)
            else:
                previous_quantity = product.stock_quantity
                new_quantity = previous_quantity + quantity_change

                product._inventory_movement_handled = True
                product.stock_quantity = new_quantity
                product.save()

                movement = InventoryMovement.objects.create(
                    product=product,
                    type=type,
                    quantity_change=quantity_change,
                    previous_quantity=previous_quantity,
                    new_quantity=new_quantity,
                    reason=reason,
                    user=request.user
                )
                log_action(request.user, 'INVENTORY_ADJUSTED', 'product', product.id, f"Adjusted stock for {product.name} by {quantity_change}", request)
                return Response(ProductSerializer(product).data)

        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except ProductVariant.DoesNotExist:
            return Response({'error': 'Variant not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({'error': 'Invalid quantity_change'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='low-stock')
    def low_stock(self, request):
        # Find products or variants below threshold
        low_stock_products = Product.objects.filter(stock_quantity__lte=models.F('low_stock_threshold'))
        low_stock_variants = ProductVariant.objects.filter(stock_quantity__lte=models.F('low_stock_threshold'))

        return Response({
            'products': ProductSerializer(low_stock_products, many=True).data,
            'variants': ProductVariantSerializer(low_stock_variants, many=True).data
        })
