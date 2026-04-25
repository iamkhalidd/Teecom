from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

@shared_task
def send_notification_email(user_id, title, message):
    try:
        user = User.objects.get(id=user_id)
        # Create in-app notification
        Notification.objects.create(
            user=user,
            type='system_alert',
            title=title,
            message=message
        )

        # Send Email
        send_mail(
            title,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return f"Email sent to {user.email}"
    except User.DoesNotExist:
        return "User not found"
    except Exception as e:
        return str(e)
