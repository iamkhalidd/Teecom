from rest_framework import serializers
from .models import HeroBanner, AnnouncementBar, ContentBlock
from products.serializers import ProductSerializer
from categories.serializers import CategorySerializer

class HeroBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroBanner
        fields = '__all__'

class AnnouncementBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnouncementBar
        fields = '__all__'

class ContentBlockSerializer(serializers.ModelSerializer):
    products_data = ProductSerializer(source='products', many=True, read_only=True)
    categories_data = CategorySerializer(source='categories', many=True, read_only=True)

    class Meta:
        model = ContentBlock
        fields = '__all__'
