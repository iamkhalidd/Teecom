from rest_framework import serializers
from .models import SEOMetadata, Redirect

class SEOMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOMetadata
        fields = [
            'title', 'description', 'canonical_url',
            'og_title', 'og_description', 'og_image',
            'index', 'follow'
        ]

class RedirectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Redirect
        fields = '__all__'
