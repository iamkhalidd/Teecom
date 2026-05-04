import pyotp
import qrcode
import io
import base64
from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from .models import Address, Wallet, SupportTicket, SupportMessage, AuditLog
from .serializers import (
    UserSerializer, RegisterSerializer, AddressSerializer,
    WalletSerializer, SupportTicketSerializer, SupportMessageSerializer,
    AuditLogSerializer, TwoFactorSerializer, SessionSerializer
)
from core.permissions import IsOwnerOrAdmin, IsAdminUser

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({'is_active': user.is_active})

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WalletViewSet(viewsets.ModelViewSet):
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return Wallet.objects.filter(user=self.request.user)

class SupportTicketViewSet(viewsets.ModelViewSet):
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_staff or getattr(self.request.user, 'role', '') == 'admin':
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        ticket = self.get_object()
        message_text = request.data.get('message')
        if not message_text:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

        message = SupportMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            message=message_text,
            attachment_url=request.data.get('attachment_url')
        )
        return Response(SupportMessageSerializer(message).data, status=status.HTTP_201_CREATED)

class SupportMessageViewSet(viewsets.ModelViewSet):
    queryset = SupportMessage.objects.all()
    serializer_class = SupportMessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return SupportMessage.objects.filter(ticket__user=self.request.user)

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['user', 'action_type', 'entity_type']

class TwoFactorView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.two_factor_enabled:
            return Response({'enabled': True})

        secret = pyotp.random_base32()
        otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=user.email,
            issuer_name="LUMOCART"
        )

        img = qrcode.make(otp_uri)
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return Response({
            'enabled': False,
            'secret': secret,
            'qr_code': f"data:image/png;base64,{img_str}"
        })

    def post(self, request):
        serializer = TwoFactorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        code = serializer.validated_data['code']
        secret = serializer.validated_data.get('secret')

        if user.two_factor_enabled:
            # Verify and disable
            totp = pyotp.TOTP(user.two_factor_secret)
            if totp.verify(code):
                user.two_factor_enabled = False
                user.two_factor_secret = None
                user.save()
                return Response({'status': 'disabled'})
        else:
            # Verify and enable
            if not secret:
                return Response({'error': 'Secret is required'}, status=400)
            totp = pyotp.TOTP(secret)
            if totp.verify(code):
                user.two_factor_enabled = True
                user.two_factor_secret = secret
                user.save()
                return Response({'status': 'enabled'})

        return Response({'error': 'Invalid code'}, status=400)

class SessionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        tokens = OutstandingToken.objects.filter(user=request.user)
        # Filter out blacklisted
        blacklisted = BlacklistedToken.objects.values_list('token_id', flat=True)
        active_tokens = tokens.exclude(id__in=blacklisted)

        data = []
        for token in active_tokens:
            data.append({
                'id': token.id,
                'jti': token.jti,
                'created_at': token.created_at,
                'expires_at': token.expires_at,
            })
        return Response(data)

    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        try:
            token = OutstandingToken.objects.get(id=pk, user=request.user)
            BlacklistedToken.objects.get_or_create(token=token)
            return Response({'status': 'revoked'})
        except OutstandingToken.DoesNotExist:
            return Response({'error': 'Token not found'}, status=404)
