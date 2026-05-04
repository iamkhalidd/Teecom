from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Address, Wallet, WalletTransaction, SupportTicket, SupportMessage, AuditLog

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone', 'role', 'avatar_url', 'is_verified', 'is_active')
        read_only_fields = ('role', 'is_verified', 'is_active')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm', 'full_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name']
        )
        return user

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ('user',)

class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = '__all__'

class WalletSerializer(serializers.ModelSerializer):
    transactions = WalletTransactionSerializer(many=True, read_only=True)
    class Meta:
        model = Wallet
        fields = '__all__'
        read_only_fields = ('user',)

class SupportMessageSerializer(serializers.ModelSerializer):
    sender_role = serializers.ReadOnlyField(source='sender.role')

    class Meta:
        model = SupportMessage
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    messages = SupportMessageSerializer(many=True, read_only=True)
    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ('user',)

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = AuditLog
        fields = '__all__'

class TwoFactorSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)
    secret = serializers.CharField(max_length=32, required=False)

class SessionSerializer(serializers.Serializer):
    jti = serializers.CharField()
    created_at = serializers.DateTimeField()
    expires_at = serializers.DateTimeField()
    ip_address = serializers.IPAddressField(required=False)
    user_agent = serializers.CharField(required=False)
