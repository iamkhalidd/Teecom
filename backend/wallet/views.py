from rest_framework import viewsets, permissions
from .models import Wallet, WalletTransaction
from .serializers import WalletSerializer, WalletTransactionSerializer

class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WalletSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Wallet.objects.filter(user=self.request.user)

class WalletTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WalletTransactionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return WalletTransaction.objects.filter(wallet__user=self.request.user)
