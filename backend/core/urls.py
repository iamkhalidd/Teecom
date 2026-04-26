from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include('accounts.urls')),
    path("api/products/", include('products.urls')),
    path("api/categories/", include('categories.urls')),
    path("api/carts/", include('carts.urls')),
    path("api/orders/", include('orders.urls')),
    path("api/payments/", include('payments.urls')),
    path("api/shipping/", include('shipping.urls')),
    path("api/reviews/", include('reviews.urls')),
    path("api/dashboard/", include('dashboard.urls')),
]
