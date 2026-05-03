from django.db import models
from django.conf import settings
from django.utils import timezone


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('order_update', 'Order Update'),
        ('message', 'New Message'),
        ('promotion', 'Promotion'),
        ('system', 'System Notification'),
        ('support_reply', 'Support Reply'),
        ('payment', 'Payment Update'),
        ('shipping', 'Shipping Update'),
    )
    
    PRIORITY_LEVELS = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_notifications'
    )
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    
    # Optional links to related objects
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object_type = models.CharField(max_length=50, null=True, blank=True)
    
    # For actions (like "View Order", "Reply", etc.)
    action_url = models.CharField(max_length=500, blank=True, null=True)
    action_label = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read', '-created_at']),
            models.Index(fields=['recipient', 'notification_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.recipient.email}"
    
    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    def archive(self):
        self.is_archived = True
        self.save(update_fields=['is_archived'])


class NotificationPreference(models.Model):
    """User preferences for notification types and delivery methods"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )
    
    # Email notifications
    email_order_updates = models.BooleanField(default=True)
    email_messages = models.BooleanField(default=True)
    email_promotions = models.BooleanField(default=False)
    email_system = models.BooleanField(default=True)
    email_support_reply = models.BooleanField(default=True)
    email_payment_updates = models.BooleanField(default=True)
    email_shipping_updates = models.BooleanField(default=True)
    
    # In-app notifications (all enabled by default)
    in_app_order_updates = models.BooleanField(default=True)
    in_app_messages = models.BooleanField(default=True)
    in_app_promotions = models.BooleanField(default=True)
    in_app_system = models.BooleanField(default=True)
    in_app_support_reply = models.BooleanField(default=True)
    in_app_payment_updates = models.BooleanField(default=True)
    in_app_shipping_updates = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Notification preferences for {self.user.email}"