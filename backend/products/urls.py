from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, SpecialOfferViewSet, NewsletterSubscriberViewSet, InventoryViewSet

router = DefaultRouter()
router.register(r'offers', SpecialOfferViewSet)
router.register(r'newsletter', NewsletterSubscriberViewSet)
router.register(r'inventory', InventoryViewSet, basename='inventory')
router.register(r'', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
