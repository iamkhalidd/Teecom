from django.db.models.signals import post_save
from django.dispatch import receiver
from store.models import Order
from wallet.models import WalletTransaction
from .models import Notification
from .tasks import send_notification_email

@receiver(post_save, sender=Order)
def order_status_notification(sender, instance, created, **kwargs):
    if created:
        title = f"Order Placed: {instance.order_number}"
        message = f"Your order {instance.order_number} has been placed successfully."
    else:
        title = f"Order Updated: {instance.order_number}"
        message = f"Your order {instance.order_number} status has been updated to {instance.status}."

    Notification.objects.create(
        user=instance.user,
        type='order_update',
        title=title,
        message=message,
        link=f"/orders/{instance.order_number}"
    )
    # Trigger async email
    send_notification_email.delay(instance.user.id, title, message)

@receiver(post_save, sender=WalletTransaction)
def wallet_transaction_notification(sender, instance, created, **kwargs):
    if created and instance.status == 'completed':
        title = "Wallet Update"
        message = f"Your wallet has been updated. Amount: {instance.amount} ({instance.type})"

        Notification.objects.create(
            user=instance.wallet.user,
            type='wallet_update',
            title=title,
            message=message
        )
        send_notification_email.delay(instance.wallet.user.id, title, message)
