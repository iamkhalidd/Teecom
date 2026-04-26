from rest_framework import serializers
from .models import Order, OrderItem, Coupon, Wishlist
from products.models import Product
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('user',)

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Product.objects.all(), source='products', write_only=True
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'products', 'product_ids', 'created_at', 'updated_at']
        read_only_fields = ['user']
