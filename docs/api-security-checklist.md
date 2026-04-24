# API Security Checklist

## Backend (Django)
- [x] DEBUG is False in production.
- [x] SECRET_KEY is loaded from environment variables.
- [x] ALLOWED_HOSTS is strict in production.
- [x] CORS_ALLOWED_ORIGINS is explicit in production.
- [x] JWT tokens have appropriate expiration.
- [x] All sensitive endpoints have `permission_classes`.
- [x] Object-level permissions (IDOR protection) implemented via `IsOwner`.
- [x] `get_queryset` filters by `request.user` for user-owned resources.
- [x] Rate limiting (Throttling) enabled for all endpoints.
- [x] Stricter throttling for auth endpoints.
- [x] Passwords and sensitive fields are `write_only` or `read_only` in serializers.
- [x] Security headers (X-Frame-Options, STS, etc.) configured.
- [x] Secure cookie settings enabled for production.
- [x] Input validation enforced via Serializers.

## Frontend (Next.js)
- [x] No sensitive backend secrets in `frontend/`.
- [x] `NEXT_PUBLIC_` used only for public-safe variables.
- [x] No sensitive data leaked in `console.log`.
- [x] Production builds do not expose source maps (default Next.js behavior).
