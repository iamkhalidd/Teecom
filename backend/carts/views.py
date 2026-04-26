from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product
from core.permissions import IsOwnerOrAdmin

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrAdmin)

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get', 'post'])
    def current(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        if request.method == 'POST':
            product_id = request.data.get('product')
            quantity = int(request.data.get('quantity', 1))
            size = request.data.get('size')
            color = request.data.get('color')

            try:
                product = Product.objects.get(id=product_id)
                item, item_created = CartItem.objects.get_or_create(
                    cart=cart,
                    product=product,
                    size=size,
                    color=color,
                    defaults={'price_snapshot': product.price, 'quantity': 0}
                )
                item.quantity += quantity
                item.save()
                return Response(CartSerializer(cart).data)
            except Product.DoesNotExist:
                return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(CartSerializer(cart).data)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrAdmin)

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)
