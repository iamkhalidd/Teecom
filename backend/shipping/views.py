from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ShippingMethod, ShippingZone
from .serializers import ShippingMethodSerializer, ShippingZoneSerializer
from core.permissions import IsAdminUser
from accounts.utils import log_action

class ShippingZoneViewSet(viewsets.ModelViewSet):
    queryset = ShippingZone.objects.all()
    serializer_class = ShippingZoneSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        zone = serializer.save()
        log_action(self.request.user, 'SHIPPING_ZONE_CREATED', 'shipping_zone', zone.id, f"Created shipping zone: {zone.name}", self.request)

    def perform_update(self, serializer):
        zone = serializer.save()
        log_action(self.request.user, 'SHIPPING_ZONE_UPDATED', 'shipping_zone', zone.id, f"Updated shipping zone: {zone.name}", self.request)

    def perform_destroy(self, instance):
        zone_id = instance.id
        zone_name = instance.name
        instance.delete()
        log_action(self.request.user, 'SHIPPING_ZONE_DELETED', 'shipping_zone', zone_id, f"Deleted shipping zone: {zone_name}", self.request)

class ShippingMethodViewSet(viewsets.ModelViewSet):
    queryset = ShippingMethod.objects.all()
    serializer_class = ShippingMethodSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        method = serializer.save()
        log_action(self.request.user, 'SHIPPING_METHOD_CREATED', 'shipping_method', method.id, f"Created shipping method: {method.name}", self.request)

    def perform_update(self, serializer):
        method = serializer.save()
        log_action(self.request.user, 'SHIPPING_METHOD_UPDATED', 'shipping_method', method.id, f"Updated shipping method: {method.name}", self.request)

    def perform_destroy(self, instance):
        method_id = instance.id
        method_name = instance.name
        instance.delete()
        log_action(self.request.user, 'SHIPPING_METHOD_DELETED', 'shipping_method', method_id, f"Deleted shipping method: {method_name}", self.request)
