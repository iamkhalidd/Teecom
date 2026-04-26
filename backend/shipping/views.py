from rest_framework import viewsets, permissions
from .models import ShippingMethod
from .serializers import ShippingMethodSerializer
from core.permissions import IsAdminUser

class ShippingMethodViewSet(viewsets.ModelViewSet):
    queryset = ShippingMethod.objects.all()
    serializer_class = ShippingMethodSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]
