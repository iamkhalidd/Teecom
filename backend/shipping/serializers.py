from rest_framework import serializers
from .models import ShippingMethod, ShippingZone

class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = '__all__'

class ShippingZoneSerializer(serializers.ModelSerializer):
    methods = ShippingMethodSerializer(many=True, read_only=True)

    class Meta:
        model = ShippingZone
        fields = '__all__'
