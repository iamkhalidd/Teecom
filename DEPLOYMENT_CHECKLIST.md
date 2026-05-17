# Deployment Preparation Checklist

Complete checklist for deploying Teecom to production after Phase 3 implementation.

## Pre-Deployment Verification

### Code Quality
- [ ] All tests passing (`python manage.py test`)
- [ ] No security warnings (`python manage.py check --deploy`)
- [ ] No console errors in browser
- [ ] No console warnings in backend logs
- [ ] Code follows project conventions
- [ ] No hardcoded credentials or secrets
- [ ] All TODOs/FIXMEs resolved or documented

### Database
- [ ] All migrations created and tested locally
- [ ] Migration files reviewed and approved
- [ ] Database backup strategy documented
- [ ] Rollback plan documented
- [ ] No migrations that lock tables for long
- [ ] AdminSettings model created with get_or_create
- [ ] All new fields have appropriate defaults

### Configuration
- [ ] Environment variables documented in .env.example
- [ ] All required env vars have values
- [ ] DEBUG = False in production
- [ ] SECRET_KEY set to random value
- [ ] ALLOWED_HOSTS configured
- [ ] CORS settings appropriate for domain
- [ ] Email configuration tested
- [ ] File storage backend configured (S3/Cloudinary)

### Security
- [ ] Demo token bypass removed (verified in tests)
- [ ] 2FA secrets not exposed in responses
- [ ] Passwords never returned in API
- [ ] Auth endpoints properly protected
- [ ] HTTPS enabled on production
- [ ] CSRF protection enabled
- [ ] SQL injection vectors tested and blocked
- [ ] XSS injection vectors tested and blocked

### Functionality
- [ ] Orders can be created and modified
- [ ] Order status updates work
- [ ] Inventory restock works
- [ ] Customer search works
- [ ] SEO health check works
- [ ] Sitemap regeneration works
- [ ] Coupons can be created and validated
- [ ] Settings save and load correctly
- [ ] 2FA setup and verification works
- [ ] Avatar upload works

### Performance
- [ ] Page load time < 2s average
- [ ] API response time < 500ms average
- [ ] No N+1 query problems
- [ ] Caching configured
- [ ] Static files minified
- [ ] Images optimized
- [ ] Database indexes created on frequently queried fields

### Monitoring & Logging
- [ ] Error logging configured (e.g., Sentry)
- [ ] Access logging configured
- [ ] Audit logging working
- [ ] Log rotation configured
- [ ] Monitoring alerts configured
- [ ] Performance metrics configured
- [ ] Uptime monitoring configured

---

## Server Setup

### Infrastructure
- [ ] Production database provisioned
- [ ] Database backups automated (daily)
- [ ] Redis cache provisioned
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] CDN configured (if using)
- [ ] Load balancer configured (if needed)
- [ ] Firewall rules configured
- [ ] SSH keys secured
- [ ] Root login disabled

### Application Server
- [ ] Gunicorn/uWSGI configured
- [ ] Worker processes configured (4+ recommended)
- [ ] Timeout set appropriately (60+ seconds)
- [ ] Health check endpoint configured
- [ ] Graceful shutdown enabled
- [ ] Log rotation configured
- [ ] Systemd service configured

### Web Server
- [ ] Nginx/Apache configured
- [ ] SSL/TLS configured
- [ ] HTTP/2 enabled
- [ ] Gzip compression enabled
- [ ] Cache headers set appropriately
- [ ] Security headers configured
  - [ ] Content-Security-Policy
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY
  - [ ] Strict-Transport-Security
- [ ] Rate limiting configured

### Database
- [ ] PostgreSQL version compatible
- [ ] Connection pooling configured (PgBouncer)
- [ ] Backups automated and tested
- [ ] Replication configured (if HA needed)
- [ ] Monitoring enabled
- [ ] Slow query logging enabled
- [ ] Vacuuming scheduled

### External Services
- [ ] Email service configured (SendGrid/AWS SES)
- [ ] File storage configured (S3/Cloudinary)
- [ ] Payment processor configured (if applicable)
- [ ] CDN configured (if applicable)
- [ ] Analytics configured (Google Analytics)
- [ ] Error tracking configured (Sentry)

---

## Deployment Steps

### 1. Pre-Deployment Testing (Staging)
```bash
# Run full test suite
python manage.py test

# Run security check
python manage.py check --deploy

# Run performance tests
python manage.py test performance_tests

# Run E2E tests
python manage.py test e2e_tests
```

### 2. Database Migration
```bash
# Show pending migrations
python manage.py showmigrations

# Apply migrations to staging first
python manage.py migrate

# Verify AdminSettings created
python manage.py shell
>>> from accounts.models import AdminSettings
>>> AdminSettings.objects.get_or_create(pk=1)
>>> exit()
```

### 3. Static Files
```bash
# Collect static files
python manage.py collectstatic --noinput

# Verify assets collected
ls static/
```

### 4. Create Superuser (if needed)
```bash
python manage.py createsuperuser
# Email: admin@yourdomain.com
# Password: <generate secure password>
```

### 5. Backup Production (if existing)
```bash
# Backup database
pg_dump teecom_db | gzip > backups/teecom-pre-deploy-$(date +%Y%m%d).sql.gz

# Backup media files
tar -czf backups/media-pre-deploy-$(date +%Y%m%d).tar.gz media/

# Verify backups
ls -lh backups/
```

### 6. Deploy Code
```bash
# Pull latest code
git pull origin main

# Install dependencies
pip install -r requirements.txt

# Restart application
systemctl restart teecom

# Verify application is running
systemctl status teecom
```

### 7. Smoke Testing
```bash
# Test admin login
curl -X POST http://api.yourdomain.com/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test products endpoint
curl http://api.yourdomain.com/products/ \
  -H "Authorization: Bearer <token>"

# Test orders endpoint
curl http://api.yourdomain.com/orders/ \
  -H "Authorization: Bearer <token>"

# Check health status
curl http://api.yourdomain.com/health/
```

### 8. Frontend Deployment
```bash
cd frontend
npm run build
npm run export  # or deploy to Vercel/Netlify

cd ../admin-dashboard
npm run build
npm run export
```

### 9. Verify All Services
- [ ] API responding at /api/
- [ ] Frontend loading at /
- [ ] Admin dashboard loading at /admin
- [ ] Static files serving correctly
- [ ] Database connections working
- [ ] Redis cache working
- [ ] Email sending working (test email)
- [ ] File uploads working

### 10. Monitor Logs
```bash
# Watch application logs
journalctl -u teecom -f

# Check database logs
tail -f /var/log/postgresql/postgresql.log

# Check web server logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Post-Deployment

### Verification (First 24 Hours)
- [ ] Monitor error rates (target: < 1%)
- [ ] Monitor response times (target: < 500ms avg)
- [ ] Check database query performance
- [ ] Verify all scheduled jobs running
- [ ] Monitor server resource usage (CPU, memory, disk)
- [ ] Check log files for errors
- [ ] Verify backups ran successfully
- [ ] Monitor user feedback/bug reports

### Content Updates
- [ ] Update store settings in admin
- [ ] Upload store logo/favicon
- [ ] Configure store colors
- [ ] Configure timezone and currency
- [ ] Update store email addresses
- [ ] Set up initial products/categories
- [ ] Generate initial sitemap
- [ ] Update homepage content

### Communication
- [ ] Notify stakeholders of deployment
- [ ] Provide admin login credentials
- [ ] Share deployment notes with team
- [ ] Document any known issues
- [ ] Schedule post-deployment review

---

## Rollback Plan

If deployment fails or critical issues discovered:

### Immediate Rollback
```bash
# Stop application
systemctl stop teecom

# Restore previous code
git checkout previous-tag

# Restore database (if needed)
dropdb teecom_db
createdb teecom_db
gunzip < backups/teecom-pre-deploy-*.sql.gz | psql teecom_db

# Restart application
systemctl start teecom
```

### Communication
- Notify all stakeholders
- Update status page
- Document what went wrong
- Schedule incident review

---

## Production Maintenance

### Daily
- [ ] Monitor error rates
- [ ] Check disk space
- [ ] Verify backups ran
- [ ] Review access logs for attacks

### Weekly
- [ ] Review database performance
- [ ] Check security updates available
- [ ] Review user feedback
- [ ] Update status page

### Monthly
- [ ] Apply security patches
- [ ] Optimize database (VACUUM, REINDEX)
- [ ] Review audit logs
- [ ] Performance analysis and tuning
- [ ] Security assessment

### Quarterly
- [ ] Full backup restoration test
- [ ] Disaster recovery plan test
- [ ] Security audit
- [ ] Feature roadmap review

---

## Key Contacts

| Role | Name | Email | Phone |
|------|------|-------|-------|
| DevOps Lead | | | |
| Database Admin | | | |
| Security Officer | | | |
| Emergency Contact | | | |

---

## Deployment Checklist Sign-Off

### Prepared By
- [ ] Developer: _________________________ Date: _______
- [ ] Code Reviewer: __________________ Date: _______

### Verified By
- [ ] QA: _____________________________ Date: _______
- [ ] DevOps: _________________________ Date: _______

### Approved By
- [ ] Tech Lead: _______________________ Date: _______
- [ ] Project Manager: ________________ Date: _______

### Deployed By
- [ ] DevOps Engineer: ________________ Date: _______
- [ ] Verified Successful: ____________ Date: _______

---

## Deployment Runbook

**Version:** 1.0  
**Last Updated:** 2024-01-15  
**Next Review:** 2024-03-15

### Quick Reference

1. **Pre-Deployment:** 30 minutes
   - Run tests: `python manage.py test`
   - Security check: `python manage.py check --deploy`
   - Backup database

2. **Deployment:** 15 minutes
   - Pull code: `git pull origin main`
   - Install deps: `pip install -r requirements.txt`
   - Migrate DB: `python manage.py migrate`
   - Collect static: `python manage.py collectstatic --noinput`
   - Restart app: `systemctl restart teecom`

3. **Verification:** 15 minutes
   - Smoke tests
   - Check logs
   - Monitor metrics

4. **Total Time:** ~1 hour

### Estimated Downtime

With zero-downtime deployment setup:
- **Current:** < 5 minutes
- **Target:** < 1 minute
- **With canary:** 0 minutes (gradual rollout)

---

## Notes

- Always test migrations in staging first
- Keep backups for at least 30 days
- Document all production changes
- Communicate with team during deployment
- Have rollback plan ready
- Monitor closely after deployment
- Update this checklist based on lessons learned

---

**Phase 3 Deployment Ready** ✓
