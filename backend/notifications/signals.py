from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import models
from .models import Notification
from accounts.models import WalletTransaction, SupportMessage, SupportTicket
from orders.models import Order
from products.models import Product

User = get_user_model()


@receiver(post_save, sender=WalletTransaction)
def create_wallet_transaction_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.wallet.user,
            notification_type='payment',
            title=f"Wallet {instance.type.title()}",
            message=f"${instance.amount} has been {instance.type}ed to your wallet.",
            priority='medium',
            action_url=f"/wallet/transactions/{instance.id}/",
            action_label="View Transaction"
        )


@receiver(post_save, sender=SupportMessage)
def create_support_reply_notification(sender, instance, created, **kwargs):
    if created and instance.sender != instance.ticket.user:
        Notification.objects.create(
            recipient=instance.ticket.user,
            notification_type='support_reply',
            title="New Support Reply",
            message=f"You have received a reply to your ticket: {instance.ticket.subject}",
            priority='high',
            action_url=f"/support/tickets/{instance.ticket.id}/",
            action_label="View Ticket"
        )


@receiver(post_save, sender=Order)
def create_order_status_notification(sender, instance, created, **kwargs):
    # Only send notification for status changes (not creation)
    if not created:
        # Check if status changed using model_utils
        if hasattr(instance, '_status_changed') and instance._status_changed:
            status_messages = {
                'processing': 'Your order is being processed',
                'shipped': 'Your order has been shipped',
                'delivered': 'Your order has been delivered',
                'cancelled': 'Your order has been cancelled',
                'refunded': 'Your order has been refunded',
            }
            
            if instance.status in status_messages:
                Notification.objects.create(
                    recipient=instance.user,
                    notification_type='order_update',
                    title=f"Order Status Update",
                    message=f"Order #{instance.order_number}: {status_messages[instance.status]}",
                    priority='medium' if instance.status != 'cancelled' else 'high',
                    action_url=f"/orders/{instance.id}/",
                    action_label="View Order"
                )


@receiver(post_save, sender=Product)
def create_low_stock_notification(sender, instance, created, **kwargs):
    # For low stock notifications, we'll check current stock level
    # In a production app, we'd want to track when it crosses the threshold
    if instance.stock_quantity <= 5 and instance.stock_quantity > 0:
        # Notify admins/managers about low stock
        from accounts.models import User
        from django.db.models import Q
        
        admins = User.objects.filter(
            Q(role='admin') | Q(role='manager') | Q(is_staff=True)
        )
        
        for admin in admins:
            # Check if we've already sent a low stock notification recently for this product
            # Simple approach: check if there's an unread low stock notification for this product in last hour
            recent_notification = Notification.objects.filter(
                recipient=admin,
                notification_type='system',
                title="Low Stock Alert",
                message__contains=instance.name,
                created_at__gte=timezone.now() - timezone.timedelta(hours=1),
                is_read=False
            ).first()
            
            if not recent_notification:
                Notification.objects.create(
                    recipient=admin,
                    notification_type='system',
                    title="Low Stock Alert",
                    message=f"Product '{instance.name}' is running low on stock ({instance.stock_quantity} left).",
                    priority='high',
                    action_url=f"/products/{instance.id}/",
                    action_label="View Product"
                )