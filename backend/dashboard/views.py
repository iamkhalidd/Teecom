from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from orders.models import Order
from orders.serializers import OrderSerializer
from products.models import Product
from accounts.models import User
from core.permissions import IsAdminUser

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Stats
        total_revenue = Order.objects.filter(status='paid').aggregate(Sum('total'))['total__sum'] or 0
        total_orders = Order.objects.count()
        total_customers = User.objects.filter(role='customer').count()

        # Trends (last 30 days)
        last_month = timezone.now() - timedelta(days=30)
        new_customers = User.objects.filter(role='customer', created_at__gte=last_month).count()
        recent_orders_count = Order.objects.filter(created_at__gte=last_month).count()

        # Top Products
        top_products = Product.objects.annotate(
            order_count=Count('orderitem_set')
        ).order_by('-order_count')[:5]

        top_products_data = [{
            'id': p.id,
            'name': p.name,
            'sales': p.order_count
        } for p in top_products]

        recent_orders = OrderSerializer(Order.objects.order_by('-created_at')[:5], many=True).data

        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'total_customers': total_customers,
            'new_customers_30d': new_customers,
            'recent_orders_30d': recent_orders_count,
            'top_products': top_products_data,
            'recent_orders': recent_orders
        })
