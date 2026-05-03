from rest_framework import serializers
from .models import Notification, NotificationPreference
from django.contrib.auth import get_user_model

User = get_user_model()


class NotificationSerializer(serializers.ModelSerializer):
    recipient_name = serializers.CharField(source='recipient.full_name', read_only=True)
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    time_since = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'recipient_name', 'sender', 'sender_name',
            'notification_type', 'title', 'message', 'priority', 'is_read',
            'is_archived', 'related_object_id', 'related_object_type',
            'action_url', 'action_label', 'created_at', 'updated_at',
            'time_since'
        ]
        read_only_fields = ['recipient', 'sender', 'created_at', 'updated_at']
    
    def get_time_since(self, obj):
        from django.utils.timesince import timesince
        return timesince(obj.created_at)


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']