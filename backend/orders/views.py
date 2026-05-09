from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
from .models import Order, Coupon, Wishlist
from .serializers import OrderSerializer, CouponSerializer, WishlistSerializer
from products.models import Product
from core.permissions import IsOwnerOrAdmin, IsAdminUser
from accounts.utils import log_action

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrAdmin)

    def get_queryset(self):
        if self.request.user.is_staff or getattr(self.request.user, 'role', '') == 'admin':
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='bulk-update', permission_classes=[IsAdminUser])
    def bulk_update(self, request):
        ids = request.data.get('ids', [])
        action = request.data.get('action')
        value = request.data.get('value')

        if not ids or not action:
            return Response({'error': 'ids and action are required'}, status=status.HTTP_400_BAD_REQUEST)

        orders = Order.objects.filter(id__in=ids)

        with transaction.atomic():
            if action == 'status':
                # Map potential bulk action values to order status
                # e.g. mark as processing, shipped, etc.
                orders.update(status=value)
                log_action(request.user, 'ORDER_BULK_UPDATE', 'order', None, f"Bulk updated status to {value} for {orders.count()} orders", request)
            elif action == 'payment_status':
                orders.update(payment_status=value)
                log_action(request.user, 'ORDER_BULK_UPDATE', 'order', None, f"Bulk updated payment status to {value} for {orders.count()} orders", request)
            elif action == 'cancel':
                orders.update(status='cancelled')
                log_action(request.user, 'ORDER_BULK_UPDATE', 'order', None, f"Bulk cancelled {orders.count()} orders", request)
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'bulk update successful', 'count': orders.count()})

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    lookup_field = 'code'

    def get_permissions(self):
        if self.action == 'validate':
            return [permissions.IsAuthenticated()]
        return [IsAdminUser()]

    @action(detail=True, methods=['get'], url_path='validate')
    def validate(self, request, pk=None):
        # pk is the code in this case if we route correctly,
        # but DRF expects ID by default. Let's use a lookup_field.
        coupon = self.get_object()
        if not coupon.is_active or coupon.expiry_date < timezone.now():
            return Response({'valid': False, 'message': 'Coupon expired or inactive'}, status=status.HTTP_400_BAD_REQUEST)
        if coupon.used_count >= coupon.usage_limit:
            return Response({'valid': False, 'message': 'Usage limit reached'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'valid': True,
            'discount_percentage': coupon.discount_percentage,
            'code': coupon.code
        })

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_product(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            wishlist.products.add(product)
            return Response({'status': 'product added to wishlist'})
        except Product.DoesNotExist:
            return Response({'error': 'product not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def remove_product(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            wishlist = Wishlist.objects.get(user=request.user)
            product = Product.objects.get(id=product_id)
            wishlist.products.remove(product)
            return Response({'status': 'product removed from wishlist'})
        except (Wishlist.DoesNotExist, Product.DoesNotExist):
            return Response({'error': 'wishlist or product not found'}, status=status.HTTP_404_NOT_FOUND)
