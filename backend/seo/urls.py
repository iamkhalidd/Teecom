from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RedirectViewSet, SEOViewSet

router = DefaultRouter()
router.register(r'redirects', RedirectViewSet)
router.register(r'meta', SEOViewSet, basename='seo-meta')

urlpatterns = [
    path('', include(router.urls)),
]
