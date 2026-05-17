# Teecom E-Commerce API Documentation

Complete API reference for all backend endpoints with examples and error codes.

## Authentication

All admin endpoints require JWT bearer token authentication.

```bash
Authorization: Bearer {access_token}
```

### Login
```
POST /accounts/login/
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}

Response 200:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## Admin Settings

### Get Store Settings
```
GET /accounts/settings/general/
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "store_name": "My Store",
  "store_email": "store@example.com",
  "currency": "USD",
  "timezone": "America/New_York",
  "primary_color": "#3B82F6",
  "secondary_color": "#10B981"
}
```

### Update Store Settings
```
PATCH /accounts/settings/general/
Authorization: Bearer {token}
Content-Type: application/json

{
  "store_name": "Updated Store Name",
  "currency": "EUR",
  "timezone": "Europe/London",
  "primary_color": "#8B5CF6"
}

Response 200: Updated settings object
Response 400: Validation errors
Response 403: Insufficient permissions
```

### Get Admin Profile
```
GET /accounts/settings/profile/
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "email": "admin@example.com",
  "full_name": "John Admin",
  "phone": "+1234567890",
  "avatar_url": "/media/avatars/admin_123.jpg"
}
```

### Update Admin Profile
```
PATCH /accounts/settings/profile/
Authorization: Bearer {token}
Content-Type: application/json

{
  "full_name": "John Admin",
  "phone": "+9876543210"
}

Response 200: Updated profile
Response 400: Invalid data
```

### Change Password
```
POST /accounts/change-password/
Authorization: Bearer {token}
Content-Type: application/json

{
  "old_password": "CurrentPassword123!",
  "new_password": "NewPassword456!!"
}

Response 200: { "message": "Password changed successfully" }
Response 400: Old password incorrect or new password weak
```

### Upload Avatar
```
POST /accounts/me/avatar/
Authorization: Bearer {token}
Content-Type: multipart/form-data

Field: avatar (binary file, max 5MB)

Response 200:
{
  "avatar_url": "/media/avatars/admin_123.jpg",
  "message": "Avatar uploaded successfully"
}

Response 400: Invalid file type or too large
Response 413: File too large
```

---

## Products

### List Products
```
GET /products/
Authorization: Bearer {token}
Query Parameters:
  - search: Search by name
  - category: Filter by category ID
  - min_price: Minimum price
  - max_price: Maximum price
  - in_stock: Boolean (only in stock items)

Response 200:
{
  "count": 45,
  "next": "...",
  "results": [
    {
      "id": 1,
      "name": "Product Name",
      "slug": "product-name",
      "sku": "PRD-001",
      "price": 99.99,
      "stock": 50,
      "category_id": 5,
      "description": "Product description",
      "status": "active"
    }
  ]
}
```

### Get Product Details
```
GET /products/{id}/
Authorization: Bearer {token}

Response 200: Full product object with variants and reviews
Response 404: Product not found
```

### Create Product
```
POST /products/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Product",
  "slug": "new-product",
  "sku": "NEW-001",
  "price": 49.99,
  "stock": 100,
  "category_id": 5,
  "description": "Product description",
  "status": "active"
}

Response 201: Created product object
Response 400: Validation errors
Response 403: Admin only
```

### Update Product
```
PATCH /products/{id}/
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 59.99,
  "stock": 75,
  "status": "inactive"
}

Response 200: Updated product
Response 404: Not found
Response 403: Admin only
```

### Delete Product
```
DELETE /products/{id}/
Authorization: Bearer {token}

Response 204: Deleted successfully
Response 404: Not found
Response 403: Admin only
```

### Bulk Update Products
```
POST /products/bulk-update/
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": [1, 2, 3],
  "updates": {
    "status": "inactive",
    "category_id": 10
  }
}

Response 200: { "updated": 3 }
Response 403: Admin only
```

### Bulk Delete Products
```
POST /products/bulk-delete/
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": [1, 2, 3]
}

Response 200: { "deleted": 3 }
Response 403: Admin only
```

---

## Inventory Management

### List Inventory Items
```
GET /products/inventory/
Authorization: Bearer {token}

Response 200:
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "product_id": 1,
      "current_stock": 50,
      "reserved": 5,
      "available": 45,
      "reorder_level": 10
    }
  ]
}
```

### Get Low Stock Items
```
GET /products/inventory/low-stock/
Authorization: Bearer {token}
Query Parameters:
  - threshold: Low stock threshold (default: 10)

Response 200:
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "Product",
      "current_stock": 8,
      "reorder_level": 10
    }
  ]
}
```

### Adjust Inventory
```
POST /products/inventory/adjust/
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_id": 1,
  "quantity_change": 50,
  "type": "return",  # return, sale, adjustment, damage, lost
  "reason": "Stock replenishment from supplier"
}

Response 200:
{
  "message": "Inventory adjusted",
  "previous_stock": 45,
  "new_stock": 95,
  "movement_id": 123
}

Response 400: Invalid quantity or product
Response 403: Admin only
```

---

## Orders

### List Orders
```
GET /orders/
Authorization: Bearer {token}
Query Parameters:
  - status: Filter by status
  - payment_status: Filter by payment status
  - user_id: Filter by user
  - search: Search by order ID or customer name

Response 200:
{
  "count": 120,
  "results": [
    {
      "id": 1001,
      "user": { "id": 5, "email": "customer@example.com" },
      "total_amount": 299.98,
      "status": "pending",
      "payment_status": "pending",
      "created_at": "2024-01-15T10:30:00Z",
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "product_name": "Product",
          "quantity": 2,
          "price": 99.99
        }
      ]
    }
  ]
}
```

### Get Order Details
```
GET /orders/{id}/
Authorization: Bearer {token}

Response 200:
{
  "id": 1001,
  "user": { "id": 5, "email": "customer@example.com", "full_name": "John Doe" },
  "total_amount": 299.98,
  "status": "pending",
  "payment_status": "pending",
  "payment_method": "credit_card",
  "transaction_id": "txn_123456",
  "shipping_address": "123 Main St",
  "shipping_city": "New York",
  "shipping_postal_code": "10001",
  "shipping_cost": 9.99,
  "tax_amount": 24.00,
  "discount_amount": 0,
  "items": [...],
  "created_at": "2024-01-15T10:30:00Z"
}

Response 404: Not found
```

### Create Order
```
POST /orders/
Authorization: Bearer {token}
Content-Type: application/json

{
  "total_amount": 299.98,
  "status": "pending",
  "payment_method": "credit_card"
}

Response 201: Created order
Response 400: Invalid data
```

### Update Order
```
PATCH /orders/{id}/
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "processing",
  "payment_status": "paid"
}

Response 200: Updated order
Response 404: Not found
```

### Bulk Update Orders
```
POST /orders/bulk-update/
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": [1001, 1002, 1003],
  "action": "status",
  "value": "shipped"
}

Actions: status, payment_status, cancel

Response 200: { "status": "bulk update successful", "count": 3 }
Response 400: Invalid action
Response 403: Admin only
```

---

## Coupons

### List Coupons
```
GET /orders/coupons/
Authorization: Bearer {token}

Response 200:
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "code": "SAVE20",
      "discount_type": "percentage",
      "discount_value": 20,
      "max_uses": 100,
      "current_uses": 15,
      "is_active": true,
      "expiry_date": "2024-12-31"
    }
  ]
}
```

### Create Coupon
```
POST /orders/coupons/
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "SUMMER2024",
  "discount_type": "percentage",  # percentage or fixed
  "discount_value": 15,
  "max_uses": 500,
  "is_active": true,
  "expiry_date": "2024-09-30"
}

Response 201: Created coupon
Response 400: Code already exists or invalid data
Response 403: Admin only
```

### Validate Coupon
```
GET /orders/coupons/{code}/validate/
Authorization: Bearer {token}

Response 200:
{
  "valid": true,
  "code": "SAVE20",
  "discount_type": "percentage",
  "discount_value": 20,
  "remaining_uses": 85
}

Response 400: Coupon expired, invalid, or max uses reached
```

### Delete Coupon
```
DELETE /orders/coupons/{code}/
Authorization: Bearer {token}

Response 204: Deleted
Response 404: Not found
Response 403: Admin only
```

---

## SEO Management

### Get SEO Metadata
```
GET /seo/meta/get_metadata/
Authorization: Bearer {token}
Query Parameters:
  - model: Model name (product, category)
  - object_id: Object ID

Response 200:
{
  "id": 1,
  "title": "Product Title",
  "description": "SEO description",
  "canonical_url": "https://example.com/product",
  "og_title": "Social media title",
  "og_description": "Social description",
  "og_image": "https://example.com/image.jpg",
  "index": true,
  "follow": true
}

Response 400: Missing parameters
```

### Update SEO Metadata
```
POST /seo/meta/update_metadata/
Authorization: Bearer {token}
Content-Type: application/json

{
  "model": "product",
  "object_id": 1,
  "metadata": {
    "title": "New Product Title",
    "description": "Updated SEO description",
    "og_title": "Social Title"
  }
}

Response 200: Updated metadata
Response 400: Invalid model
Response 403: Admin only
```

### Get SEO Health Check
```
GET /seo/meta/health-check/
Authorization: Bearer {token}

Response 200:
{
  "overall_score": 75,
  "products": {
    "total": 50,
    "with_seo": 38,
    "coverage_percent": 76,
    "missing_description": 5
  },
  "categories": {
    "total": 10,
    "with_seo": 8,
    "coverage_percent": 80
  },
  "redirects": {
    "total": 12,
    "active": 10
  }
}
```

### Regenerate Sitemap
```
POST /seo/meta/regenerate-sitemap/
Authorization: Bearer {token}

Response 200:
{
  "message": "Sitemap regenerated successfully",
  "products_included": 50,
  "categories_included": 10,
  "sitemap_url": "/static/sitemap.xml"
}

Response 403: Admin only
```

### List URL Redirects
```
GET /seo/redirects/
Authorization: Bearer {token}

Response 200:
{
  "count": 12,
  "results": [
    {
      "id": 1,
      "source_path": "/old-product/",
      "destination_path": "/products/new-product/",
      "type": 301,
      "is_active": true,
      "hit_count": 25
    }
  ]
}
```

### Create Redirect
```
POST /seo/redirects/
Authorization: Bearer {token}
Content-Type: application/json

{
  "source_path": "/old-page/",
  "destination_path": "/new-page/",
  "type": 301,
  "is_active": true
}

Response 201: Created redirect
Response 400: Source path already exists
Response 403: Admin only
```

### Delete Redirect
```
DELETE /seo/redirects/{id}/
Authorization: Bearer {token}

Response 204: Deleted
Response 404: Not found
Response 403: Admin only
```

---

## User Management

### List All Users
```
GET /accounts/management/
Authorization: Bearer {token}

Response 200:
{
  "count": 250,
  "results": [
    {
      "id": 1,
      "email": "user@example.com",
      "full_name": "User Name",
      "role": "customer",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Toggle User Active Status
```
POST /accounts/management/{id}/toggle_active/
Authorization: Bearer {token}

Response 200:
{
  "id": 5,
  "email": "user@example.com",
  "is_active": false
}

Response 404: User not found
Response 403: Admin only
```

### Get Audit Logs
```
GET /accounts/management/audit-logs/
Authorization: Bearer {token}

Response 200:
{
  "count": 500,
  "results": [
    {
      "id": 1,
      "user": "admin@example.com",
      "action": "PASSWORD_CHANGED",
      "model": "account",
      "timestamp": "2024-01-15T10:30:00Z",
      "details": "User changed password"
    }
  ]
}
```

### Setup 2FA
```
POST /accounts/management/setup-2fa/
Authorization: Bearer {token}

Response 200:
{
  "qr_code": "data:image/png;base64,iVBOR...",
  "message": "Scan this QR code with your authenticator app"
}

Response 403: Admin only
```

### Verify 2FA
```
POST /accounts/management/verify-2fa/
Authorization: Bearer {token}
Content-Type: application/json

{
  "token": "123456"
}

Response 200: { "message": "2FA verified successfully" }
Response 400: Invalid token
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email format"],
    "price": ["Must be greater than 0"]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists or has been modified"
}
```

### 429 Too Many Requests
```json
{
  "detail": "Request was throttled. Try again in 60 seconds."
}
```

### 500 Internal Server Error
```json
{
  "error": "An internal server error occurred"
}
```

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Deleted successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource conflict |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |

---

## Rate Limiting

- General endpoints: 1000 requests/hour per user
- Login endpoint: 10 requests/hour per IP
- SEO endpoints: 100 requests/hour per user

Rate limit headers included in all responses:
- `X-RateLimit-Limit`: Total limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## Pagination

List endpoints support pagination:

```
GET /products/?page=2&limit=50

Response includes:
{
  "count": 500,
  "next": "http://api.example.com/products/?page=3&limit=50",
  "previous": "http://api.example.com/products/?page=1&limit=50",
  "results": [...]
}
```

---

## Filtering

Most list endpoints support filtering:

```
GET /orders/?status=pending&payment_status=paid
GET /products/?category=5&min_price=10&max_price=100
GET /accounts/management/?role=admin&is_active=true
```

---

## Changelog

### v1.0.0 (Phase 3 Complete)
- Added SEO health-check and sitemap regeneration endpoints
- Added order detail retrieval and status updates
- Added inventory restock functionality
- Added customer search and filtering
- Added admin settings for store configuration
- Added 2FA security features
- Fixed demo token bypass vulnerability
- Added comprehensive audit logging
