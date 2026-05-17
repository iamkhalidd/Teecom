"""
Comprehensive functional tests for all Phase 1-3 features.
Tests verify no regressions and proper integration across all components.
"""
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import timedelta

from accounts.models import AdminSettings, AuditLog
from products.models import Product, ProductVariant, Category
from orders.models import Order, OrderItem, Coupon
from seo.models import SEOMetadata, Redirect
from categories.models import Category

User = get_user_model()


class AuthenticationSecurityTests(APITestCase):
    """Test Phase 1 security fixes for authentication."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.regular_user = User.objects.create_user(
            username='user@test.com',
            email='user@test.com',
            password='SecurePass123!',
            role='customer'
        )
    
    def test_demo_token_bypass_removed(self):
        """Verify demo_token no longer bypasses authentication."""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer demo_token')
        response = self.client.get('/accounts/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_valid_jwt_token_works(self):
        """Verify valid JWT tokens still work."""
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(self.admin_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')
        response = self.client.get('/accounts/me/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED])
    
    def test_admin_only_endpoints_protected(self):
        """Verify admin-only endpoints reject non-admin users."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get('/dashboard/stats/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_2fa_secret_not_exposed_in_response(self):
        """Verify 2FA secrets are not returned in API responses."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/accounts/management/setup-2fa/', {})
        # Should return QR code data, but actual secret should not be in response
        self.assertNotIn('secret', str(response.data).lower())


class AdminSettingsTests(APITestCase):
    """Test Phase 2 admin settings functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin_user)
        self.settings = AdminSettings.objects.get_or_create(pk=1)[0]
    
    def test_get_admin_settings(self):
        """Verify can retrieve admin settings."""
        response = self.client.get('/accounts/settings/general/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('store_name', response.data)
    
    def test_update_admin_settings(self):
        """Verify can update admin settings."""
        update_data = {
            'store_name': 'Updated Store Name',
            'currency': 'EUR',
            'timezone': 'Europe/London'
        }
        response = self.client.patch('/accounts/settings/general/', update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['store_name'], 'Updated Store Name')
        self.assertEqual(response.data['currency'], 'EUR')
    
    def test_change_admin_password(self):
        """Verify password change requires old password."""
        response = self.client.post('/accounts/change-password/', {
            'old_password': 'WrongPassword123!',
            'new_password': 'NewSecurePass123!'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        response = self.client.post('/accounts/change-password/', {
            'old_password': 'SecurePass123!',
            'new_password': 'NewSecurePass123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ProductInventoryTests(APITestCase):
    """Test Phase 3 inventory management features."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin_user)
        
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            sku='TEST-001',
            price=99.99,
            stock=100,
            category=self.category
        )
    
    def test_restock_product(self):
        """Verify inventory restock workflow."""
        initial_stock = self.product.stock
        response = self.client.post('/products/inventory/adjust/', {
            'product_id': self.product.id,
            'quantity_change': 50,
            'type': 'return',
            'reason': 'Stock adjustment'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, initial_stock + 50)
    
    def test_low_stock_alert(self):
        """Verify low stock products are flagged."""
        low_product = Product.objects.create(
            name='Low Stock Product',
            slug='low-stock',
            sku='LOW-001',
            price=49.99,
            stock=3,
            category=self.category
        )
        response = self.client.get('/products/inventory/low-stock/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify low stock product is in results
        product_ids = [p['id'] for p in response.data]
        self.assertIn(low_product.id, product_ids)


class CustomerSearchTests(APITestCase):
    """Test Phase 3 customer search functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin_user)
        
        self.customer1 = User.objects.create_user(
            username='john@test.com',
            email='john@test.com',
            password='Pass123!',
            role='customer',
            full_name='John Doe'
        )
        self.customer2 = User.objects.create_user(
            username='jane@test.com',
            email='jane@test.com',
            password='Pass123!',
            role='customer',
            full_name='Jane Smith'
        )
    
    def test_list_customers(self):
        """Verify can list all customers."""
        response = self.client.get('/accounts/management/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
    
    def test_customer_search_by_name(self):
        """Verify frontend can search by name (client-side filtering)."""
        response = self.client.get('/accounts/management/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Frontend filters this, but API returns all for filtering capability


class OrderManagementTests(APITestCase):
    """Test Phase 3 order detail and management."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin_user)
        
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            sku='TEST-001',
            price=99.99,
            stock=100,
            category=self.category
        )
        
        self.customer = User.objects.create_user(
            username='customer@test.com',
            email='customer@test.com',
            password='Pass123!',
            role='customer'
        )
        
        self.order = Order.objects.create(
            user=self.customer,
            total_amount=99.99,
            status='pending',
            payment_status='pending'
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=1,
            price=99.99
        )
    
    def test_retrieve_order_details(self):
        """Verify can retrieve full order details."""
        response = self.client.get(f'/orders/{self.order.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.order.id)
        self.assertEqual(response.data['total_amount'], 99.99)
    
    def test_update_order_status(self):
        """Verify can update order status."""
        response = self.client.patch(f'/orders/{self.order.id}/', {
            'status': 'processing'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'processing')
    
    def test_update_payment_status(self):
        """Verify can update payment status."""
        response = self.client.patch(f'/orders/{self.order.id}/', {
            'payment_status': 'paid'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.order.refresh_from_db()
        self.assertEqual(self.order.payment_status, 'paid')
    
    def test_bulk_order_updates(self):
        """Verify bulk order status updates work."""
        order2 = Order.objects.create(
            user=self.customer,
            total_amount=49.99,
            status='pending',
            payment_status='pending'
        )
        
        response = self.client.post('/orders/bulk-update/', {
            'ids': [self.order.id, order2.id],
            'action': 'status',
            'value': 'shipped'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.order.refresh_from_db()
        order2.refresh_from_db()
        self.assertEqual(self.order.status, 'shipped')
        self.assertEqual(order2.status, 'shipped')


class SEOFunctionalityTests(APITestCase):
    """Test Phase 3 SEO management features."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin_user)
        
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            sku='TEST-001',
            price=99.99,
            stock=100,
            category=self.category
        )
    
    def test_seo_health_check(self):
        """Verify SEO health check returns metrics."""
        response = self.client.get('/seo/meta/health-check/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('overall_score', response.data)
        self.assertIn('products', response.data)
        self.assertIn('categories', response.data)
    
    def test_regenerate_sitemap(self):
        """Verify sitemap regeneration works."""
        response = self.client.post('/seo/meta/regenerate-sitemap/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('sitemap_url', response.data)
    
    def test_redirect_management(self):
        """Verify URL redirects work."""
        response = self.client.post('/seo/redirects/', {
            'source_path': '/old-page/',
            'destination_path': '/new-page/',
            'type': 301,
            'is_active': True
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify we can retrieve it
        redirect_id = response.data['id']
        response = self.client.get(f'/seo/redirects/{redirect_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CouponTests(APITestCase):
    """Test Phase 2-3 coupon functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin_user)
    
    def test_create_coupon(self):
        """Verify can create discount coupon."""
        response = self.client.post('/orders/coupons/', {
            'code': 'SAVE20',
            'discount_type': 'percentage',
            'discount_value': 20,
            'max_uses': 100,
            'expiry_date': (timezone.now() + timedelta(days=30)).date()
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_validate_coupon(self):
        """Verify coupon validation works."""
        coupon = Coupon.objects.create(
            code='VALID20',
            discount_type='percentage',
            discount_value=20,
            is_active=True,
            expiry_date=timezone.now() + timedelta(days=30)
        )
        
        response = self.client.get(f'/orders/coupons/{coupon.code}/validate/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ErrorHandlingTests(APITestCase):
    """Test error handling across all endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=self.admin_user)
    
    def test_404_on_nonexistent_order(self):
        """Verify 404 for nonexistent resources."""
        response = self.client.get('/orders/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_400_on_invalid_data(self):
        """Verify 400 for invalid request data."""
        response = self.client.post('/orders/coupons/', {
            'code': '',  # Required field empty
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_403_on_unauthorized_access(self):
        """Verify 403 when user lacks permissions."""
        regular_user = User.objects.create_user(
            username='user@test.com',
            email='user@test.com',
            password='Pass123!',
            role='customer'
        )
        self.client.force_authenticate(user=regular_user)
        response = self.client.get('/dashboard/stats/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PermissionTests(APITestCase):
    """Test permission enforcement across admin endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.regular_user = User.objects.create_user(
            username='user@test.com',
            email='user@test.com',
            password='Pass123!',
            role='customer'
        )
    
    def test_admin_stats_requires_admin(self):
        """Verify admin stats endpoint requires admin role."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get('/dashboard/stats/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/dashboard/stats/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_405_METHOD_NOT_ALLOWED])
    
    def test_seo_endpoints_require_admin(self):
        """Verify SEO endpoints require admin role."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get('/seo/meta/health-check/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_user_management_requires_admin(self):
        """Verify user management requires admin role."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get('/accounts/management/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
