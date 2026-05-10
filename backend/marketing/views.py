from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import EmailTemplate, Campaign, EmailLog, Unsubscribe
from .serializers import EmailTemplateSerializer, CampaignSerializer, EmailLogSerializer, UnsubscribeSerializer
from accounts.models import User
from products.models import NewsletterSubscriber

class EmailTemplateViewSet(viewsets.ModelViewSet):
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [permissions.IsAdminUser]

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        campaign = self.get_object()
        if campaign.status == 'sent':
            return Response({'error': 'Campaign already sent'}, status=status.HTTP_400_BAD_REQUEST)

        template = campaign.template
        if not template:
            return Response({'error': 'No template selected'}, status=status.HTTP_400_BAD_REQUEST)

        # Basic segmentation logic
        recipients = []
        unsubscribed_emails = set(Unsubscribe.objects.values_list('email', flat=True))

        if campaign.segment == 'all_customers':
            recipients = list(User.objects.filter(role='customer').values_list('email', flat=True))
        elif campaign.segment == 'newsletter_subscribers':
            recipients = list(NewsletterSubscriber.objects.values_list('email', flat=True))
        elif campaign.segment == 'test':
            recipients = [request.user.email]

        # Filter out unsubscribed
        recipients = [email for email in recipients if email not in unsubscribed_emails]

        if not recipients:
            return Response({'error': 'No recipients found for this segment'}, status=status.HTTP_400_BAD_REQUEST)

        campaign.status = 'sending'
        campaign.save()

        # In a real app, this should be a Celery task
        # We will simulate it here
        sent_count = 0
        for email in recipients:
            try:
                # Real email sending would go here:
                # send_mail(template.subject, template.body_text, settings.DEFAULT_FROM_EMAIL, [email], html_message=template.body_html)

                EmailLog.objects.create(
                    campaign=campaign,
                    recipient_email=email,
                    subject=template.subject,
                    status='sent'
                )
                sent_count += 1
            except Exception as e:
                EmailLog.objects.create(
                    campaign=campaign,
                    recipient_email=email,
                    subject=template.subject,
                    status='failed',
                    error_message=str(e)
                )

        campaign.status = 'sent'
        campaign.sent_at = campaign.created_at # Simplification
        campaign.save()

        return Response({'message': f'Campaign sent to {sent_count} recipients'})

class UnsubscribeViewSet(viewsets.ModelViewSet):
    queryset = Unsubscribe.objects.all()
    serializer_class = UnsubscribeSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
