from django.db.models import Sum, Count, Avg, F, Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from orders.models import Order
from products.models import Product
from accounts.models import User
from categories.models import Category

class AnalyticsService:
    @staticmethod
    def get_revenue_stats(start_date=None, end_date=None):
        if not end_date:
            end_date = timezone.now()
        if not start_date:
            start_date = end_date - timedelta(days=30)

        orders = Order.objects.filter(created_at__range=(start_date, end_date))
        paid_orders = orders.filter(status__in=['paid', 'shipped', 'delivered', 'processing'])

        gross_revenue = paid_orders.aggregate(Sum('total'))['total__sum'] or 0
        net_revenue = paid_orders.aggregate(
            net=Sum(F('total') - F('shipping_fee') - F('discount'))
        )['net'] or 0

        total_orders = orders.count()
        aov = paid_orders.aggregate(Avg('total'))['total__avg'] or 0

        refunds = orders.filter(status='refunded').aggregate(Sum('total'))['total__sum'] or 0
        discounts = orders.aggregate(Sum('discount'))['discount__sum'] or 0
        shipping_fees = orders.aggregate(Sum('shipping_fee'))['shipping_fee__sum'] or 0

        # Revenue over time
        revenue_over_time = paid_orders.annotate(date=TruncDate('created_at')) \
            .values('date') \
            .annotate(revenue=Sum('total'), count=Count('id')) \
            .order_by('date')

        # Top products
        top_products = Product.objects.filter(orderitem__order__in=paid_orders) \
            .annotate(sales_count=Count('orderitem'), revenue=Sum('orderitem__total_price')) \
            .order_by('-revenue')[:10]

        top_products_data = [{
            'id': p.id,
            'name': p.name,
            'sales': p.sales_count,
            'revenue': p.revenue
        } for p in top_products]

        # Revenue by category
        revenue_by_category = Category.objects.filter(products__orderitem__order__in=paid_orders) \
            .annotate(revenue=Sum('products__orderitem__total_price')) \
            .values('name', 'revenue') \
            .order_by('-revenue')

        # Repeat purchase rate
        total_customers = User.objects.filter(role='customer').count()
        customers_with_multiple_orders = User.objects.filter(role='customer') \
            .annotate(order_count=Count('orders', filter=Q(orders__status__in=['paid', 'shipped', 'delivered']))) \
            .filter(order_count__gt=1).count()

        repeat_rate = (customers_with_multiple_orders / total_customers * 100) if total_customers > 0 else 0

        return {
            'gross_revenue': gross_revenue,
            'net_revenue': net_revenue,
            'total_orders': total_orders,
            'aov': aov,
            'refunds': refunds,
            'discounts': discounts,
            'shipping_fees': shipping_fees,
            'revenue_over_time': revenue_over_time,
            'top_products': top_products_data,
            'revenue_by_category': revenue_by_category,
            'repeat_purchase_rate': repeat_rate,
            'period': {
                'start': start_date,
                'end': end_date
            }
        }
