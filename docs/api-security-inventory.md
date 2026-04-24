# API Security Inventory

| Method | Endpoint | Source | Purpose | Auth Required | Permission | Risk Level |
|--------|----------|--------|---------|---------------|------------|------------|
| POST | `/api/auth/register/` | Django | User Registration | No | AllowAny | Low |
| POST | `/api/auth/login/` | Django | JWT Token Obtain | No | AllowAny | Low |
| POST | `/api/auth/token/refresh/` | Django | JWT Token Refresh | No | AllowAny | Low |
| GET | `/api/auth/me/` | Django | Current User Info | Yes | IsAuthenticated | Low |
| GET | `/api/store/categories/` | Django | List Categories | No | AllowAny | Low |
| GET | `/api/store/products/` | Django | List Products | No | AllowAny | Low |
| GET/POST | `/api/store/cart/` | Django | Manage Cart | Yes | IsOwnerOrAdmin | Medium |
| GET/POST | `/api/store/orders/` | Django | Manage Orders | Yes | IsOwnerOrAdmin | Medium |
| GET | `/api/wallet/` | Django | Wallet Info | Yes | IsOwnerOrAdmin | High |
| GET | `/api/wallet/transactions/` | Django | Wallet Transactions | Yes | IsOwnerOrAdmin | High |
| GET/POST | `/api/support/tickets/` | Django | Support Tickets | Yes | IsOwnerOrAdmin | Medium |
| GET/POST | `/api/support/messages/` | Django | Ticket Messages | Yes | IsOwnerOrAdmin | Medium |

## Admin Endpoints
- `/admin/` (Django Admin) - Critical Risk - Protected by `IsSuperUser` and Django standard admin auth.
