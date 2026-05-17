from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('support', 'Support'),
        ('manager', 'Manager'),
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    avatar_url = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    def __str__(self):
        return self.email

class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='addresses')
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address_line = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)

class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class WalletTransaction(models.Model):
    TYPE_CHOICES = (
        ('top_up', 'Top Up'),
        ('purchase', 'Purchase'),
        ('refund', 'Refund'),
        ('withdrawal', 'Withdrawal'),
    )

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    reference = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, default='pending')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class SupportTicket(models.Model):
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('closed', 'Closed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tickets')
    order = models.ForeignKey('orders.Order', on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SupportMessage(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    attachment_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class AuditLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action_type = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=100, blank=True, null=True)
    entity_id = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    previous_value = models.JSONField(null=True, blank=True)
    new_value = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.action_type} - {self.created_at}"

class AdminSettings(models.Model):
    CURRENCY_CHOICES = (
        ('USD', 'US Dollar ($)'),
        ('EUR', 'Euro (€)'),
        ('GBP', 'British Pound (£)'),
        ('JPY', 'Japanese Yen (¥)'),
        ('AUD', 'Australian Dollar ($)'),
        ('CAD', 'Canadian Dollar ($)'),
        ('INR', 'Indian Rupee (₹)'),
    )
    
    TIMEZONE_CHOICES = (
        ('UTC', 'UTC (Universal Coordinated Time)'),
        ('US/Eastern', 'Eastern Time (ET)'),
        ('US/Central', 'Central Time (CT)'),
        ('US/Mountain', 'Mountain Time (MT)'),
        ('US/Pacific', 'Pacific Time (PT)'),
        ('Europe/London', 'London (GMT/BST)'),
        ('Europe/Paris', 'Paris (CET/CEST)'),
        ('Asia/Tokyo', 'Tokyo (JST)'),
        ('Asia/Dubai', 'Dubai (GST)'),
        ('Australia/Sydney', 'Sydney (AEDT/AEST)'),
        ('Asia/Kolkata', 'India Standard Time (IST)'),
    )

    store_name = models.CharField(max_length=255, default='LUMOCART')
    store_email = models.EmailField(default='support@lumocart.com')
    store_description = models.TextField(blank=True, default='Premium eCommerce store')
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    timezone = models.CharField(max_length=50, choices=TIMEZONE_CHOICES, default='UTC')
    logo_url = models.URLField(blank=True, null=True)
    favicon_url = models.URLField(blank=True, null=True)
    primary_color = models.CharField(max_length=7, default='#000000', help_text='Hex color code')
    secondary_color = models.CharField(max_length=7, default='#FFFFFF', help_text='Hex color code')
    support_phone = models.CharField(max_length=20, blank=True)
    address_line = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Admin Settings'
        verbose_name_plural = 'Admin Settings'

    def __str__(self):
        return f'Settings - {self.store_name}'
