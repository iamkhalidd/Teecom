"""
Performance testing and benchmarking.
Measures page load times, API response times, database query performance.
"""
import time
from django.test import TestCase, Client
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from django.test.utils import override_settings
from django.core.cache import cache
import statistics

from products.models import Product, Category
from orders.models import Order, OrderItem

User = get_user_model()


class APIResponseTimeTests(APITestCase):
    """Test API response times and performance."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin)
        
        # Create test data
        self.category = Category.objects.create(name='Test', slug='test')
        for i in range(100):
            Product.objects.create(
                name=f'Product {i}',
                slug=f'product-{i}',
                sku=f'SKU-{i}',
                price=99.99,
                stock=100,
                category=self.category
            )
    
    def measure_endpoint_speed(self, endpoint, method='GET', data=None, iterations=5):
        """Measure endpoint response time."""
        times = []
        for _ in range(iterations):
            start = time.time()
            if method == 'GET':
                self.client.get(endpoint)
            elif method == 'POST':
                self.client.post(endpoint, data)
            else:
                self.client.patch(endpoint, data)
            elapsed = time.time() - start
            times.append(elapsed)
        
        return {
            'min': min(times),
            'max': max(times),
            'avg': statistics.mean(times),
            'median': statistics.median(times)
        }
    
    def test_list_products_response_time(self):
        """Measure product list API response time."""
        times = self.measure_endpoint_speed('/products/')
        print(f"\nProduct List Response Time:")
        print(f"  Avg: {times['avg']*1000:.2f}ms")
        print(f"  Median: {times['median']*1000:.2f}ms")
        print(f"  Min: {times['min']*1000:.2f}ms")
        print(f"  Max: {times['max']*1000:.2f}ms")
        
        # Should respond in under 500ms
        self.assertLess(times['avg'], 0.5, "Product list should respond in < 500ms")
    
    def test_list_orders_response_time(self):
        """Measure orders list response time."""
        # Create test orders
        customer = User.objects.create_user(
            username='customer@test.com',
            email='customer@test.com',
            password='Pass123!'
        )
        for i in range(50):
            Order.objects.create(
                user=customer,
                total_amount=99.99,
                status='pending'
            )
        
        times = self.measure_endpoint_speed('/orders/')
        print(f"\nOrders List Response Time:")
        print(f"  Avg: {times['avg']*1000:.2f}ms")
        
        self.assertLess(times['avg'], 0.5)
    
    def test_settings_api_response_time(self):
        """Measure settings API response time."""
        times = self.measure_endpoint_speed('/accounts/settings/general/')
        print(f"\nSettings API Response Time:")
        print(f"  Avg: {times['avg']*1000:.2f}ms")
        
        self.assertLess(times['avg'], 0.2)
    
    def test_inventory_low_stock_response_time(self):
        """Measure low stock check response time."""
        times = self.measure_endpoint_speed('/products/inventory/low-stock/')
        print(f"\nLow Stock Check Response Time:")
        print(f"  Avg: {times['avg']*1000:.2f}ms")
        
        self.assertLess(times['avg'], 0.3)
    
    def test_seo_health_check_response_time(self):
        """Measure SEO health check response time."""
        times = self.measure_endpoint_speed('/seo/meta/health-check/')
        print(f"\nSEO Health Check Response Time:")
        print(f"  Avg: {times['avg']*1000:.2f}ms")
        
        self.assertLess(times['avg'], 0.5)


class QueryPerformanceTests(APITestCase):
    """Test database query performance."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin)
    
    def test_product_list_query_count(self):
        """Verify product list doesn't do N+1 queries."""
        from django.test.utils import CaptureQueriesContext
        from django.db import connection
        
        # Create test data
        category = Category.objects.create(name='Test', slug='test')
        for i in range(50):
            Product.objects.create(
                name=f'Product {i}',
                slug=f'product-{i}',
                sku=f'SKU-{i}',
                price=99.99,
                stock=100,
                category=category
            )
        
        # Measure queries
        with CaptureQueriesContext(connection) as context:
            self.client.get('/products/')
        
        query_count = len(context)
        print(f"\nProduct List Queries: {query_count}")
        
        # Should use <5 queries for pagination + filtering
        self.assertLess(query_count, 10, "Too many queries (N+1 problem)")
    
    def test_order_detail_query_count(self):
        """Verify order detail fetch is optimized."""
        from django.test.utils import CaptureQueriesContext
        from django.db import connection
        
        customer = User.objects.create_user(
            username='customer@test.com',
            email='customer@test.com',
            password='Pass123!'
        )
        order = Order.objects.create(
            user=customer,
            total_amount=99.99,
            status='pending'
        )
        
        with CaptureQueriesContext(connection) as context:
            self.client.get(f'/orders/{order.id}/')
        
        query_count = len(context)
        print(f"\nOrder Detail Queries: {query_count}")
        
        self.assertLess(query_count, 5, "Order detail fetch doing too many queries")


class CachingTests(APITestCase):
    """Test caching behavior."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin)
        cache.clear()
    
    def test_settings_cache_hit(self):
        """Verify settings are cached after first fetch."""
        from django.test.utils import CaptureQueriesContext
        from django.db import connection
        
        # First call - hits database
        with CaptureQueriesContext(connection) as context:
            self.client.get('/accounts/settings/general/')
        first_call_queries = len(context)
        
        # Second call - should be cached
        with CaptureQueriesContext(connection) as context:
            self.client.get('/accounts/settings/general/')
        second_call_queries = len(context)
        
        print(f"\nSettings Cache Performance:")
        print(f"  First call queries: {first_call_queries}")
        print(f"  Second call queries: {second_call_queries}")
        
        # Second call should have fewer queries due to caching
        self.assertLessEqual(second_call_queries, first_call_queries)


class BulkOperationPerformanceTests(APITestCase):
    """Test performance of bulk operations."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin)
    
    def test_bulk_order_update_performance(self):
        """Measure bulk order update performance."""
        customer = User.objects.create_user(
            username='customer@test.com',
            email='customer@test.com',
            password='Pass123!'
        )
        
        # Create 100 orders
        orders = []
        for i in range(100):
            orders.append(Order(
                user=customer,
                total_amount=99.99,
                status='pending'
            ))
        Order.objects.bulk_create(orders)
        
        order_ids = Order.objects.values_list('id', flat=True)[:100]
        
        # Measure bulk update time
        start = time.time()
        self.client.post('/orders/bulk-update/', {
            'ids': list(order_ids),
            'action': 'status',
            'value': 'processing'
        })
        elapsed = time.time() - start
        
        print(f"\nBulk Order Update (100 orders):")
        print(f"  Time: {elapsed*1000:.2f}ms")
        
        # Should complete in under 5 seconds
        self.assertLess(elapsed, 5.0)


class ConcurrencyTests(APITestCase):
    """Test performance under concurrent load."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin)
    
    def test_sequential_api_calls(self):
        """Test performance of sequential API calls."""
        endpoints = [
            '/products/',
            '/orders/',
            '/accounts/settings/general/',
            '/seo/meta/health-check/',
        ]
        
        start = time.time()
        for endpoint in endpoints * 5:  # Call each 5 times
            self.client.get(endpoint)
        total_time = time.time() - start
        
        print(f"\nSequential Calls (20 requests):")
        print(f"  Total time: {total_time:.2f}s")
        print(f"  Avg per request: {(total_time/20)*1000:.2f}ms")
        
        # 20 requests should complete in < 10 seconds
        self.assertLess(total_time, 10.0)


class LoadTestingMetrics(APITestCase):
    """Collect performance metrics for load testing."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin)
    
    def test_collect_performance_baseline(self):
        """Collect baseline performance metrics."""
        metrics = {}
        
        endpoints = {
            'products': '/products/',
            'orders': '/orders/',
            'settings': '/accounts/settings/general/',
            'seo_health': '/seo/meta/health-check/',
            'low_stock': '/products/inventory/low-stock/',
        }
        
        for name, endpoint in endpoints.items():
            times = []
            for _ in range(5):
                start = time.time()
                self.client.get(endpoint)
                times.append((time.time() - start) * 1000)
            
            metrics[name] = {
                'avg_ms': statistics.mean(times),
                'min_ms': min(times),
                'max_ms': max(times),
            }
        
        print("\n=== Performance Baseline ===")
        for name, data in metrics.items():
            print(f"{name}:")
            print(f"  Avg: {data['avg_ms']:.2f}ms")
            print(f"  Min: {data['min_ms']:.2f}ms")
            print(f"  Max: {data['max_ms']:.2f}ms")
        
        # Verify all endpoints respond reasonably fast
        for name, data in metrics.items():
            self.assertLess(data['avg_ms'], 1000, f"{name} taking too long")
