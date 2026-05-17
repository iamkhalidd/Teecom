# Teecom E-Commerce Platform - Setup & Deployment Guide

Complete guide for setting up, configuring, and deploying the Teecom e-commerce platform after Phase 3 implementation.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Configuration](#database-configuration)
5. [Environment Variables](#environment-variables)
6. [Running Tests](#running-tests)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- Python 3.9+
- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- Git

### System Requirements
- 2+ GB RAM
- 5+ GB disk space
- Ubuntu 20.04+ / macOS 11+ / Windows with WSL2

---

## Backend Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create Environment File
```bash
cp .env.example .env
```

### 5. Configure Environment (see [Environment Variables](#environment-variables) section)

### 6. Create Database
```bash
# Create PostgreSQL database
createdb teecom_db

# Or using psql:
psql -c "CREATE DATABASE teecom_db;"
```

### 7. Run Migrations
```bash
python manage.py migrate

# Create new migrations if models changed:
python manage.py makemigrations
python manage.py migrate
```

**Important New Models in Phase 3:**
- `AdminSettings` - Store configuration (created via migration)
- Creates singleton record automatically

Migrations will run automatically during deploy.

### 8. Create Superuser
```bash
python manage.py createsuperuser
# Email: admin@example.com
# Password: <secure password>
```

### 9. Create Admin Settings
```bash
python manage.py shell
>>> from accounts.models import AdminSettings
>>> settings, created = AdminSettings.objects.get_or_create(pk=1)
>>> settings.store_name = "My E-Commerce Store"
>>> settings.currency = "USD"
>>> settings.timezone = "America/New_York"
>>> settings.save()
>>> exit()
```

### 10. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 11. Run Development Server
```bash
python manage.py runserver
# API available at http://localhost:8000
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

Add to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run Development Server
```bash
npm run dev
# Frontend available at http://localhost:3000
```

### 4. Setup Admin Dashboard
```bash
cd ../admin-dashboard
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Teecom Admin
```

Run admin dashboard:
```bash
npm run dev
# Admin dashboard available at http://localhost:3001
```

---

## Database Configuration

### PostgreSQL Setup

```bash
# Connect to postgres
psql -U postgres

# Create database and user
CREATE DATABASE teecom_db;
CREATE USER teecom_user WITH PASSWORD 'secure_password_123';
ALTER ROLE teecom_user SET client_encoding TO 'utf8';
ALTER ROLE teecom_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE teecom_user SET default_transaction_deferrable TO on;
ALTER ROLE teecom_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE teecom_db TO teecom_user;
\q
```

### Run Migrations
```bash
python manage.py migrate

# Output should show:
# Running migrations:
#   Applying accounts.0001_initial...
#   Applying accounts.0002_adminsettings...
#   ...
```

### Create Test Data
```bash
python manage.py shell
>>> from products.models import Category, Product
>>> c = Category.objects.create(name="Test", slug="test")
>>> Product.objects.create(
...     name="Sample Product",
...     slug="sample",
...     sku="SAMPLE-001",
...     price=99.99,
...     stock=100,
...     category=c
... )
>>> exit()
```

---

## Environment Variables

### Backend `.env` File

```bash
# Django
DEBUG=False
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database
DATABASE_URL=postgresql://teecom_user:secure_password_123@localhost:5432/teecom_db

# Redis (for caching & Celery)
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=3600  # seconds (1 hour)
JWT_REFRESH_TOKEN_LIFETIME=604800  # seconds (7 days)

# Email (for notifications)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# File Storage
STORAGE_TYPE=local  # or cloudinary, s3
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security
SECURE_SSL_REDIRECT=False  # Set to True in production
SESSION_COOKIE_SECURE=False  # Set to True in production
CSRF_COOKIE_SECURE=False  # Set to True in production

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Admin Settings (auto-created, but can override)
STORE_NAME=My E-Commerce Store
STORE_CURRENCY=USD
STORE_TIMEZONE=America/New_York
```

### Frontend `.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Teecom
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Admin Dashboard `.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Teecom Admin
NEXT_PUBLIC_ADMIN_FEATURES=true
```

---

## Running Tests

### Backend Tests

```bash
# Run all tests
python manage.py test

# Run specific test file
python manage.py test tests

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html

# Run security tests
python manage.py test security_tests

# Run E2E tests
python manage.py test e2e_tests

# Run with verbose output
python manage.py test --verbosity=2

# Run tests matching pattern
python manage.py test tests.AuthenticationSecurityTests
```

### Test Database

Tests use a separate test database. To reset:

```bash
python manage.py test --keepdb  # Reuses test DB
python manage.py test  # Creates fresh test DB each time
```

### Frontend Tests

```bash
cd frontend
npm run test

cd ../admin-dashboard
npm run test
```

---

## Deployment

### Pre-Deployment Checklist

```bash
# 1. Run all tests
python manage.py test --keepdb

# 2. Check for security issues
python manage.py check --deploy

# 3. Verify migrations
python manage.py showmigrations

# 4. Collect static files
python manage.py collectstatic --noinput

# 5. Check environment variables
env | grep DJANGO
env | grep DATABASE
env | grep REDIS
```

### Production Environment Setup

#### 1. Update Django Settings
```bash
DEBUG=False
SECRET_KEY=<generate new key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

#### 2. Use PostgreSQL
```bash
DATABASE_URL=postgresql://user:password@db-server:5432/teecom_db
```

#### 3. Configure Redis
```bash
REDIS_URL=redis://cache-server:6379/0
```

#### 4. Setup Email Service
```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=<sendgrid-api-key>
```

#### 5. Configure File Storage
```bash
# For AWS S3
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_STORAGE_BUCKET_NAME=<bucket-name>

# For Cloudinary
STORAGE_TYPE=cloudinary
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```

### Deployment with Docker

#### Build Image
```bash
docker build -t teecom:latest .
```

#### Run Container
```bash
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e SECRET_KEY=... \
  -e DEBUG=False \
  teecom:latest
```

### Deployment with Gunicorn + Nginx

#### Install Gunicorn
```bash
pip install gunicorn
```

#### Create Systemd Service
```bash
sudo nano /etc/systemd/system/teecom.service

[Unit]
Description=Teecom Gunicorn
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/teecom
Environment="PATH=/var/www/teecom/venv/bin"
ExecStart=/var/www/teecom/venv/bin/gunicorn \
    --workers 4 \
    --bind unix:/var/www/teecom/gunicorn.sock \
    config.wsgi:application

[Install]
WantedBy=multi-user.target
```

#### Enable Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable teecom
sudo systemctl start teecom
```

#### Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/teecom

server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://unix:/var/www/teecom/gunicorn.sock;
    }

    location /static {
        alias /var/www/teecom/static;
    }

    location /media {
        alias /var/www/teecom/media;
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/teecom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Monitoring

```bash
# Monitor Gunicorn
systemctl status teecom

# Monitor Database
pg_stat_statements  # PostgreSQL stats

# Monitor Redis
redis-cli info stats

# View Logs
journalctl -u teecom -f
```

---

## Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: could not translate host name "localhost" to address: Unknown host
```

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify connection string in .env
DATABASE_URL=postgresql://user:password@localhost:5432/teecom_db
```

#### Redis Connection Error
```
Error: Connection refused
```

**Solution:**
```bash
# Start Redis
redis-server

# Or on systemd:
sudo systemctl start redis-server
```

#### Migration Errors
```
NO_MIGRATIONS_MODULE_ERROR
```

**Solution:**
```bash
# Create migrations directory
mkdir -p accounts/migrations
touch accounts/migrations/__init__.py

# Create migrations
python manage.py makemigrations
python manage.py migrate
```

#### 2FA Secret Not Displaying
```
Error: Setup data not available
```

**Cause:** Session expired or user not authenticated

**Solution:**
```bash
# Verify user has admin role
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> u = User.objects.get(email='admin@example.com')
>>> u.role = 'admin'
>>> u.is_staff = True
>>> u.save()
```

#### Admin Settings Not Found
```
Error: AdminSettings matching query does not exist
```

**Solution:**
```bash
python manage.py shell
>>> from accounts.models import AdminSettings
>>> AdminSettings.objects.get_or_create(pk=1)
```

#### Inventory Adjustment Failed
```
Error: Product not found
```

**Solution:**
```bash
# Verify product exists and has correct ID
python manage.py shell
>>> from products.models import Product
>>> Product.objects.filter(id=1)
```

#### Sitemap Not Generating
```
Error: Static directory not found
```

**Solution:**
```bash
# Create static directory
mkdir -p static

# Collect static files
python manage.py collectstatic --noinput
```

#### CORS Errors in Frontend
```
Error: Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
Update `.env`:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

Or in Django settings:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://yourdomain.com"
]
```

---

## Performance Optimization

### Database Optimization
```python
# Add indexes in Django ORM
class Product(models.Model):
    sku = models.CharField(max_length=50, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
```

### Redis Caching
```python
# Cache order list
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)  # Cache for 5 minutes
def order_list(request):
    ...
```

### Query Optimization
```python
# Use select_related for foreign keys
orders = Order.objects.select_related('user').all()

# Use prefetch_related for M2M
orders = Order.objects.prefetch_related('items__product').all()
```

---

## Security Hardening

### SSL/TLS Certificate
```bash
# Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### Firewall Configuration
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Regular Backups
```bash
# PostgreSQL backup
pg_dump teecom_db > backup-$(date +%Y%m%d).sql

# Automated backup (crontab)
0 2 * * * pg_dump teecom_db | gzip > /backups/teecom-$(date +\%Y\%m\%d).sql.gz
```

---

## Support & Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [DRF Documentation](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

---

**Phase 3 Implementation Complete** ✓
- Security fixes deployed
- Admin settings configured
- Order management operational
- SEO features active
- All tests passing
