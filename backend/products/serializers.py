from rest_framework import serializers
from .models import Product, ProductImage, ProductVariant, SpecialOffer, NewsletterSubscriber, InventoryMovement

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = '__all__'

class SpecialOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialOffer
        fields = '__all__'

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'

class InventoryMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    variant_name = serializers.SerializerMethodField()
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = InventoryMovement
        fields = '__all__'

    def get_variant_name(self, obj):
        if obj.variant:
            return f"{obj.variant.size}/{obj.variant.color}"
        return None
