from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CategoryViewSet, ProductViewSet, CartViewSet, OrderViewSet,
                    CouponViewSet, SpecialOfferViewSet, WishlistViewSet, NewsletterSubscriberViewSet)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'coupons', CouponViewSet)
router.register(r'special-offers', SpecialOfferViewSet)
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'newsletter', NewsletterSubscriberViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
