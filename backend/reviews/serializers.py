from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    user_full_name = serializers.ReadOnlyField(source='user.full_name')
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user', 'replied_at', 'updated_at')
