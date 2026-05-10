from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmailTemplateViewSet, CampaignViewSet, UnsubscribeViewSet

router = DefaultRouter()
router.register(r'templates', EmailTemplateViewSet)
router.register(r'campaigns', CampaignViewSet)
router.register(r'unsubscribe', UnsubscribeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
