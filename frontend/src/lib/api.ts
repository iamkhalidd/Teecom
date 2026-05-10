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

  if (auth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  // If 401 and we have a refresh token, try silent refresh
  if (response.status === 401 && auth && typeof window !== 'undefined') {
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
      // Do not redirect on home page for optional auth data like unread counts
      if (window.location.pathname !== '/') {
        window.location.href = '/account'
      }
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
    create: (data: any) => apiFetch('/orders/', { method: 'POST', body: JSON.stringify(data) }),
    wishlist: {
      get: () => apiFetch('/orders/wishlist/'),
      add: (productId: number) => apiFetch('/orders/wishlist/add_product/', { method: 'POST', body: JSON.stringify({ product_id: productId }) }),
      remove: (productId: number) => apiFetch('/orders/wishlist/remove_product/', { method: 'POST', body: JSON.stringify({ product_id: productId }) }),
    },
    coupons: {
      list: () => apiFetch('/orders/coupons/'),
      validate: (code: string) => apiFetch(`/orders/coupons/${code}/validate/`),
      deleteCoupon: (id: number) => apiFetch(`/orders/coupons/${id}/`, { method: 'DELETE' }),
    }
  },
  shipping: {
    methods: () => apiFetch('/shipping/methods/', { auth: false }),
  },
  reviews: {
    list: (productId: number) => apiFetch(`/reviews/?product=${productId}`, { auth: false }),
    create: (data: any) => apiFetch('/reviews/', { method: 'POST', body: JSON.stringify(data) }),
  },
  content: {
    banners: () => apiFetch('/content/banners/', { auth: false }),
    announcements: () => apiFetch('/content/announcements/', { auth: false }),
    blocks: () => apiFetch('/content/blocks/', { auth: false }),
  },
  admin: {
    stats: () => apiFetch('/dashboard/stats/'),
    traffic: {
      listSearches: () => apiFetch('/dashboard/searches/'),
    },
    products: {
      list: () => apiFetch('/products/'),
      create: (data: any) => apiFetch('/products/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: any) => apiFetch(`/products/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: number) => apiFetch(`/products/${id}/`, { method: 'DELETE' }),
    },
    users: {
      list: () => apiFetch('/accounts/management/'),
      toggleActive: (id: number) => apiFetch(`/accounts/management/${id}/toggle_active/`, { method: 'POST' }),
    }
  },
  dashboard: {
    trackSearch: (data: any) => apiFetch('/dashboard/track/search/', { method: 'POST', body: JSON.stringify(data), auth: false }),
    trackProductView: (data: any) => apiFetch('/dashboard/track/product-view/', { method: 'POST', body: JSON.stringify(data), auth: false }),
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
  }
}
