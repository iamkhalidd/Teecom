from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CouponViewSet, WishlistViewSet

router = DefaultRouter()
router.register(r'coupons', CouponViewSet)
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
