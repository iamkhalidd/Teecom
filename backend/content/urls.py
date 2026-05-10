from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HeroBannerViewSet, AnnouncementBarViewSet, ContentBlockViewSet

router = DefaultRouter()
router.register(r'banners', HeroBannerViewSet)
router.register(r'announcements', AnnouncementBarViewSet)
router.register(r'blocks', ContentBlockViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
