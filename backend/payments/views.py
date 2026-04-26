from rest_framework import viewsets, permissions
from .models import Payment
from .serializers import PaymentSerializer
from core.permissions import IsOwnerOrAdmin

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user)
