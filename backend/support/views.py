from rest_framework import viewsets, permissions
from .models import SupportTicket, SupportMessage
from .serializers import SupportTicketSerializer, SupportMessageSerializer

class SupportTicketViewSet(viewsets.ModelViewSet):
    serializer_class = SupportTicketSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return SupportTicket.objects.filter(user=self.request.user)

class SupportMessageViewSet(viewsets.ModelViewSet):
    serializer_class = SupportMessageSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return SupportMessage.objects.filter(ticket__user=self.request.user)
