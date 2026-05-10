const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface RequestOptions extends RequestInit {
  auth?: boolean
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
  if (!refreshToken) return null

  try {
    const response = await fetch(`${API_URL}/accounts/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('access_token', data.access)
      return data.access
    } else {
      // Refresh token expired — full logout
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return null
    }
  } catch {
    return null
  }
}

export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const { auth = true, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)
  headers.set('Content-Type', 'application/json')

  const token = auth && typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  // If 401 and we have a refresh token, try silent refresh
  if (response.status === 401 && auth && typeof window !== 'undefined') {
    if (token === 'demo_token') {
      // In demo mode, don't crash or redirect
      return null
    }

    const newToken = await refreshAccessToken()
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`)
      response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      })
    } else {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
      throw new Error('Session expired')
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.detail || error.message || response.statusText)
  }

  // Handle 204 No Content (e.g. DELETE)
  if (response.status === 204) return null

  return response.json()
}

export const api = {
  auth: {
    login: (credentials: any) => apiFetch('/accounts/login/', { method: 'POST', body: JSON.stringify(credentials), auth: false }),
    register: (data: any) => apiFetch('/accounts/register/', { method: 'POST', body: JSON.stringify(data), auth: false }),
    me: () => apiFetch('/accounts/me/'),
  },
  accounts: {
    addresses: {
      list: () => apiFetch('/accounts/addresses/'),
      create: (data: any) => apiFetch('/accounts/addresses/', { method: 'POST', body: JSON.stringify(data) }),
    },
    support: {
      list: () => apiFetch('/accounts/support/'),
      create: (data: any) => apiFetch('/accounts/support/', { method: 'POST', body: JSON.stringify(data) }),
      reply: (ticketId: number, message: string) => apiFetch(`/accounts/support/${ticketId}/reply/`, { method: 'POST', body: JSON.stringify({ message }) }),
    }
  },
  products: {
    list: (params?: string) => apiFetch(`/products/${params ? `?${params}` : ''}`, { auth: false }),
    detail: (slug: string) => apiFetch(`/products/${slug}/`, { auth: false }),
    categories: () => apiFetch('/categories/', { auth: false }),
    offers: () => apiFetch('/products/offers/', { auth: false }),
  },
  carts: {
    get: () => apiFetch('/carts/current/'),
    addItem: (data: any) => apiFetch('/carts/current/', { method: 'POST', body: JSON.stringify(data) }),
    updateItem: (id: number, data: any) => apiFetch(`/carts/items/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    removeItem: (id: number) => apiFetch(`/carts/items/${id}/`, { method: 'DELETE' }),
  },
  orders: {
    list: () => apiFetch('/orders/'),
    detail: (id: string) => apiFetch(`/orders/${id}/`),
    create: (data: any) => apiFetch('/orders/', { method: 'POST', body: JSON.stringify(data) }),
    bulkUpdate: (data: any) => apiFetch('/orders/bulk-update/', { method: 'POST', body: JSON.stringify(data) }),
    wishlist: {
      get: () => apiFetch('/orders/wishlist/'),
      add: (productId: number) => apiFetch('/orders/wishlist/add_product/', { method: 'POST', body: JSON.stringify({ product_id: productId }) }),
      remove: (productId: number) => apiFetch('/orders/wishlist/remove_product/', { method: 'POST', body: JSON.stringify({ product_id: productId }) }),
    },
    coupons: {
      list: () => apiFetch('/orders/coupons/'),
      create: (data: any) => apiFetch('/orders/coupons/', { method: 'POST', body: JSON.stringify(data) }),
      validate: (code: string) => apiFetch(`/orders/coupons/${code}/validate/`),
      deleteCoupon: (code: string) => apiFetch(`/orders/coupons/${code}/`, { method: 'DELETE' }),
    }
  },
  shipping: {
    methods: () => apiFetch('/shipping/methods/', { auth: false }),
  },
  reviews: {
    list: (productId: number) => apiFetch(`/reviews/?product=${productId}`, { auth: false }),
    create: (data: any) => apiFetch('/reviews/', { method: 'POST', body: JSON.stringify(data) }),
  },
  admin: {
    stats: (params?: string) => apiFetch(`/dashboard/stats/${params ? `?${params}` : ""}`),
    products: {
      list: () => apiFetch('/products/'),
      create: (data: any) => apiFetch('/products/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: any) => apiFetch(`/products/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: number) => apiFetch(`/products/${id}/`, { method: 'DELETE' }),
      bulkUpdate: (data: any) => apiFetch('/products/bulk-update/', { method: 'POST', body: JSON.stringify(data) }),
      bulkDelete: (data: any) => apiFetch('/products/bulk-delete/', { method: 'POST', body: JSON.stringify(data) }),
    },
    shipping: {
      zones: {
        list: () => apiFetch('/shipping/zones/'),
        create: (data: any) => apiFetch('/shipping/zones/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: number, data: any) => apiFetch(`/shipping/zones/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
        delete: (id: number) => apiFetch(`/shipping/zones/${id}/`, { method: 'DELETE' }),
      },
      adminMethods: {
        create: (data: any) => apiFetch('/shipping/methods/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: number, data: any) => apiFetch(`/shipping/methods/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
        delete: (id: number) => apiFetch(`/shipping/methods/${id}/`, { method: 'DELETE' }),
      }
    },
    users: {
      list: () => apiFetch('/accounts/management/'),
      toggleActive: (id: number) => apiFetch(`/accounts/management/${id}/toggle_active/`, { method: 'POST' }),
      auditLogs: () => apiFetch('/accounts/management/audit-logs/'),
      setup2FA: () => apiFetch('/accounts/management/setup-2fa/', { method: 'POST' }),
      verify2FA: (data: any) => apiFetch('/accounts/management/verify-2fa/', { method: 'POST', body: JSON.stringify(data) }),
      disable2FA: (data: any) => apiFetch('/accounts/management/disable-2fa/', { method: 'POST', body: JSON.stringify(data) }),
      sessions: () => apiFetch('/accounts/management/sessions/'),
      revokeSession: (id: number) => apiFetch(`/accounts/management/${id}/revoke-session/`, { method: 'POST' }),
      logoutOthers: () => apiFetch('/accounts/management/logout-others/', { method: 'POST' }),
    },
    inventory: {
      list: (params?: string) => apiFetch(`/products/inventory/${params ? `?${params}` : ''}`),
      adjust: (data: any) => apiFetch('/products/inventory/adjust/', { method: 'POST', body: JSON.stringify(data) }),
      lowStock: () => apiFetch('/products/inventory/low-stock/'),
    },
    seo: {
      getMeta: (model: string, id: number) => apiFetch(`/seo/meta/get_metadata/?model=${model}&object_id=${id}`),
      updateMeta: (data: any) => apiFetch('/seo/meta/update_metadata/', { method: 'POST', body: JSON.stringify(data) }),
      redirects: {
        list: () => apiFetch('/seo/redirects/'),
        create: (data: any) => apiFetch('/seo/redirects/', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id: number) => apiFetch(`/seo/redirects/${id}/`, { method: 'DELETE' }),
      }
    },
    notifications: {
      list: (params?: string) => apiFetch(`/notifications/notifications/${params ? `?${params}` : ''}`),
      unreadCount: () => apiFetch('/notifications/notifications/unread_count/'),
      markAsRead: (id: number) => apiFetch(`/notifications/notifications/${id}/mark_as_read/`, { method: 'POST' }),
      markAsUnread: (id: number) => apiFetch(`/notifications/notifications/${id}/mark_as_unread/`, { method: 'POST' }),
      archive: (id: number) => apiFetch(`/notifications/notifications/${id}/archive/`, { method: 'POST' }),
      markAllAsRead: () => apiFetch('/notifications/notifications/mark_all_as_read/', { method: 'POST' }),
      clearRead: () => apiFetch('/notifications/notifications/clear_read/', { method: 'DELETE' }),
      preferences: {
        get: () => apiFetch('/notifications/preferences/my_preferences/'),
        update: (data: any) => apiFetch('/notifications/preferences/my_preferences/', { method: 'PUT' }),
        partialUpdate: (data: any) => apiFetch('/notifications/preferences/my_preferences/', { method: 'PATCH' }),
      }
    },
    content: {
      banners: {
        list: () => apiFetch('/content/banners/'),
        create: (data: any) => apiFetch('/content/banners/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: number, data: any) => apiFetch(`/content/banners/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
        delete: (id: number) => apiFetch(`/content/banners/${id}/`, { method: 'DELETE' }),
      },
      announcements: {
        list: () => apiFetch('/content/announcements/'),
        create: (data: any) => apiFetch('/content/announcements/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: number, data: any) => apiFetch(`/content/announcements/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
        delete: (id: number) => apiFetch(`/content/announcements/${id}/`, { method: 'DELETE' }),
      },
      blocks: {
        list: () => apiFetch('/content/blocks/'),
        create: (data: any) => apiFetch('/content/blocks/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: number, data: any) => apiFetch(`/content/blocks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
        delete: (id: number) => apiFetch(`/content/blocks/${id}/`, { method: 'DELETE' }),
      }
    },
    reviews: {
      list: (params?: string) => apiFetch(`/reviews/${params ? `?${params}` : ""}`),
      update: (id: number, data: any) => apiFetch(`/reviews/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      reply: (id: number, data: any) => apiFetch(`/reviews/${id}/reply/`, { method: 'POST', body: JSON.stringify(data) }),
      delete: (id: number) => apiFetch(`/reviews/${id}/`, { method: 'DELETE' }),
    },
    marketing: {
      templates: {
        list: () => apiFetch('/marketing/templates/'),
        create: (data: any) => apiFetch('/marketing/templates/', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id: number) => apiFetch(`/marketing/templates/${id}/`, { method: 'DELETE' }),
      },
      campaigns: {
        list: () => apiFetch('/marketing/campaigns/'),
        create: (data: any) => apiFetch('/marketing/campaigns/', { method: 'POST', body: JSON.stringify(data) }),
        send: (id: number) => apiFetch(`/marketing/campaigns/${id}/send/`, { method: 'POST' }),
        delete: (id: number) => apiFetch(`/marketing/campaigns/${id}/`, { method: 'DELETE' }),
      }
    },
    traffic: {
      searches: () => apiFetch('/dashboard/searches/'),
    }
  }
}
