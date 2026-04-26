from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserDetailView, UserViewSet, AddressViewSet, WalletViewSet, SupportTicketViewSet, SupportMessageViewSet

router = DefaultRouter()
router.register(r'management', UserViewSet, basename='user-management')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'wallet', WalletViewSet, basename='wallet')
router.register(r'support/messages', SupportMessageViewSet, basename='support-message')
router.register(r'support', SupportTicketViewSet, basename='support')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('', include(router.urls)),
]
