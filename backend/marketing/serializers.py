from rest_framework import serializers
from .models import EmailTemplate, Campaign, EmailLog, Unsubscribe

class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    template_name = serializers.ReadOnlyField(source='template.name')

    class Meta:
        model = Campaign
        fields = '__all__'

class EmailLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailLog
        fields = '__all__'

class UnsubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unsubscribe
        fields = '__all__'
