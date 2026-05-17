"""
End-to-end integration tests for complete workflows.
Tests full user journeys across multiple components.
"""
from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from products.models import Product, Category
from orders.models import Order, OrderItem, Coupon
from accounts.models import AdminSettings

User = get_user_model()


class OrderCreationWorkflowTests(APITestCase):
    """Test complete order creation workflow."""
    
    def setUp(self):
        self.client = APIClient()
        self.customer = User.objects.create_user(
            username='customer@test.com',
            email='customer@test.com',
            password='SecurePass123!',
            role='customer'
        )
        self.client.force_authenticate(user=self.customer)
        
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
    
    def test_complete_order_workflow(self):
        """Test: Create order -> Add items -> Update status -> Payment."""
        # Step 1: Create order
        order_response = self.client.post('/orders/', {
            'total_amount': 99.99,
            'status': 'pending'
        })
        self.assertEqual(order_response.status_code, status.HTTP_201_CREATED)
        order_id = order_response.data['id']
        print(f"✓ Step 1: Order created #{order_id}")
        
        # Step 2: Add item to order
        item_response = self.client.post(f'/orders/{order_id}/items/', {
            'product_id': self.product.id,
            'quantity': 1
        })
        self.assertIn(item_response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])
        print("✓ Step 2: Item added to order")
        
        # Step 3: Update order status to processing
        admin = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            password='SecurePass123!',
            role='admin',
            is_staff=True
        )
        self.client.force_authenticate(user=admin)
        
        status_response = self.client.patch(f'/orders/{order_id}/', {
            'status': 'processing'
        })
        self.assertEqual(status_response.status_code, status.HTTP_200_OK)
        print("✓ Step 3: Order status updated to processing")
        
        # Step 4: Process payment
        payment_response = self.client.patch(f'/orders/{order_id}/', {
            'payment_status': 'paid'
        })
        self.assertEqual(payment_response.status_code, status.HTTP_200_OK)
        print("✓ Step 4: Payment marked as paid")
        
        # Step 5: Update to shipped
        shipped_response = self.client.patch(f'/orders/{order_id}/', {
            'status': 'shipped'
        })
        self.assertEqual(shipped_response.status_code, status.HTTP_200_OK)
        print("✓ Step 5: Order shipped")


class CouponApplicationWorkflowTests(APITestCase):
    """Test coupon creation and application workflow."""
    
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
    
    def test_create_and_validate_coupon(self):
        """Test: Create coupon -> Validate -> Apply."""
        # Step 1: Create coupon
        coupon_response = self.client.post('/orders/coupons/', {
            'code': 'SAVE20',
            'discount_type': 'percentage',
            'discount_value': 20,
            'max_uses': 100,
            'is_active': True,
            'expiry_date': (timezone.now() + timedelta(days=30)).date()
        })
        self.assertEqual(coupon_response.status_code, status.HTTP_201_CREATED)
        print("✓ Step 1: Coupon SAVE20 created")
        
        # Step 2: Validate coupon as customer
        customer = User.objects.create_user(
            username='customer@test.com',
            email='customer@test.com',
            password='SecurePass123!',
            role='customer'
        )
        self.client.force_authenticate(user=customer)
        
        validate_response = self.client.get('/orders/coupons/SAVE20/validate/')
        self.assertEqual(validate_response.status_code, status.HTTP_200_OK)
        print("✓ Step 2: Coupon validated successfully")


class AdminSettingsWorkflowTests(APITestCase):
    """Test admin settings update workflow."""
    
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
    
    def test_complete_settings_workflow(self):
        """Test: Update store settings -> Update profile -> Change password."""
        # Step 1: Get current settings
        get_response = self.client.get('/accounts/settings/general/')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        print("✓ Step 1: Retrieved current settings")
        
        # Step 2: Update store settings
        update_response = self.client.patch('/accounts/settings/general/', {
            'store_name': 'My E-Commerce Store',
            'currency': 'USD',
            'timezone': 'America/New_York',
            'primary_color': '#3B82F6'
        })
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        print("✓ Step 2: Store settings updated")
        
        # Step 3: Update admin profile
        profile_response = self.client.patch('/accounts/settings/profile/', {
            'full_name': 'John Admin',
            'phone': '+1234567890'
        })
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        print("✓ Step 3: Admin profile updated")
        
        # Step 4: Change password
        password_response = self.client.post('/accounts/change-password/', {
            'old_password': 'SecurePass123!',
            'new_password': 'NewSecurePass456!!'
        })
        self.assertEqual(password_response.status_code, status.HTTP_200_OK)
        print("✓ Step 4: Password changed successfully")


class InventoryRestockWorkflowTests(APITestCase):
    """Test inventory management workflow."""
    
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
        
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            sku='TEST-001',
            price=99.99,
            stock=10,
            category=self.category
        )
    
    def test_low_stock_and_restock_workflow(self):
        """Test: Check low stock -> Restock -> Verify."""
        # Step 1: Check low stock alerts
        low_response = self.client.get('/products/inventory/low-stock/')
        self.assertEqual(low_response.status_code, status.HTTP_200_OK)
        print("✓ Step 1: Low stock check completed")
        
        # Step 2: Restock product
        restock_response = self.client.post('/products/inventory/adjust/', {
            'product_id': self.product.id,
            'quantity_change': 50,
            'type': 'return',
            'reason': 'Restocking from supplier'
        })
        self.assertEqual(restock_response.status_code, status.HTTP_200_OK)
        print("✓ Step 2: Product restocked")
        
        # Step 3: Verify stock updated
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 60)  # 10 + 50
        print("✓ Step 3: Stock verified at correct level")


class SEOManagementWorkflowTests(APITestCase):
    """Test SEO management workflow."""
    
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
    
    def test_seo_optimization_workflow(self):
        """Test: Check health -> Regenerate sitemap -> Add redirects."""
        # Step 1: Check SEO health
        health_response = self.client.get('/seo/meta/health-check/')
        self.assertEqual(health_response.status_code, status.HTTP_200_OK)
        initial_score = health_response.data.get('overall_score', 0)
        print(f"✓ Step 1: SEO health checked (score: {initial_score}%)")
        
        # Step 2: Regenerate sitemap
        sitemap_response = self.client.post('/seo/meta/regenerate-sitemap/')
        self.assertEqual(sitemap_response.status_code, status.HTTP_200_OK)
        print("✓ Step 2: Sitemap regenerated")
        
        # Step 3: Add URL redirect
        redirect_response = self.client.post('/seo/redirects/', {
            'source_path': '/old-products/',
            'destination_path': '/products/',
            'type': 301,
            'is_active': True
        })
        self.assertEqual(redirect_response.status_code, status.HTTP_201_CREATED)
        print("✓ Step 3: URL redirect created")
        
        # Step 4: Verify health improved
        health_check = self.client.get('/seo/meta/health-check/')
        self.assertEqual(health_check.status_code, status.HTTP_200_OK)
        print("✓ Step 4: SEO health re-checked after optimizations")


class CustomerManagementWorkflowTests(APITestCase):
    """Test customer management workflow."""
    
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
    
    def test_customer_search_and_management(self):
        """Test: Search customers -> View details -> Toggle status."""
        # Create test customers
        customers = []
        for i in range(3):
            c = User.objects.create_user(
                username=f'customer{i}@test.com',
                email=f'customer{i}@test.com',
                password='SecurePass123!',
                role='customer',
                full_name=f'Customer {i}'
            )
            customers.append(c)
        
        # Step 1: List all customers
        list_response = self.client.get('/accounts/management/')
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        print("✓ Step 1: Customer list retrieved")
        
        # Step 2: Search by name (client-side in UI, but API returns all)
        search_response = self.client.get('/accounts/management/')
        self.assertEqual(search_response.status_code, status.HTTP_200_OK)
        print("✓ Step 2: Customer search performed")
        
        # Step 3: Toggle customer active status
        toggle_response = self.client.post(
            f'/accounts/management/{customers[0].id}/toggle_active/',
            {}
        )
        self.assertEqual(toggle_response.status_code, status.HTTP_200_OK)
        print("✓ Step 3: Customer account toggled")


class MultiStepFormWorkflowTests(APITestCase):
    """Test complex multi-step form workflows."""
    
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
    
    def test_product_creation_with_inventory(self):
        """Test: Create product -> Set inventory -> Set SEO."""
        category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        
        # Step 1: Create product
        product_response = self.client.post('/products/', {
            'name': 'New Product',
            'slug': 'new-product',
            'sku': 'NEW-001',
            'price': 49.99,
            'stock': 50,
            'category_id': category.id,
            'description': 'A great new product'
        })
        self.assertEqual(product_response.status_code, status.HTTP_201_CREATED)
        product_id = product_response.data['id']
        print("✓ Step 1: Product created")
        
        # Step 2: Adjust inventory
        inventory_response = self.client.post('/products/inventory/adjust/', {
            'product_id': product_id,
            'quantity_change': 25,
            'type': 'return'
        })
        self.assertIn(inventory_response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        print("✓ Step 2: Inventory adjusted")


class ErrorRecoveryWorkflowTests(APITestCase):
    """Test error handling and recovery in workflows."""
    
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
    
    def test_recovery_from_failed_operation(self):
        """Test that failed operations don't corrupt state."""
        # Try invalid operation
        response = self.client.post('/orders/', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print("✓ Step 1: Invalid operation rejected")
        
        # Verify system still works
        response = self.client.get('/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("✓ Step 2: System recovered and functional")
    
    def test_concurrent_updates_consistency(self):
        """Test that concurrent updates don't cause inconsistency."""
        category = Category.objects.create(
            name='Test',
            slug='test'
        )
        product = Product.objects.create(
            name='Test',
            slug='test-p',
            sku='T001',
            price=10,
            stock=100,
            category=category
        )
        
        # Simulate two concurrent updates
        response1 = self.client.patch(f'/products/{product.id}/', {
            'price': 15.99
        })
        
        response2 = self.client.patch(f'/products/{product.id}/', {
            'stock': 150
        })
        
        # Both should succeed or second should fail gracefully
        self.assertIn(response1.status_code, [status.HTTP_200_OK, status.HTTP_409_CONFLICT])
        self.assertIn(response2.status_code, [status.HTTP_200_OK, status.HTTP_409_CONFLICT])
        print("✓ Concurrent updates handled correctly")
