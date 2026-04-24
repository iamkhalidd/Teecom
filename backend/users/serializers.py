from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone', 'role', 'avatar_url', 'is_verified', 'created_at')
        read_only_fields = ('id', 'email', 'role', 'is_verified', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'full_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name']
        )
        return user
