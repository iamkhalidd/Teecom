const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface RequestOptions extends RequestInit {
  auth?: boolean
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

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    window.location.href = '/login'
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || response.statusText)
  }

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
    wallet: {
        get: () => apiFetch('/accounts/wallet/'),
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
        listCoupons: () => apiFetch('/orders/coupons/'), // Alias for consistency in dashboard
        deleteCoupon: (id: number) => apiFetch(`/orders/coupons/${id}/`, { method: 'DELETE' }),
    }
  },
  shipping: {
    methods: () => apiFetch('/shipping/methods/'),
  },
  reviews: {
    list: (productId: number) => apiFetch(`/reviews/?product=${productId}`, { auth: false }),
    create: (data: any) => apiFetch('/reviews/', { method: 'POST', body: JSON.stringify(data) }),
  },
  admin: {
    stats: () => apiFetch('/dashboard/stats/'),
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
  }
}
