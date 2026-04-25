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
    // Optional: handle refresh token logic here
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
    login: (credentials: any) => apiFetch('/auth/login/', { method: 'POST', body: JSON.stringify(credentials), auth: false }),
    register: (data: any) => apiFetch('/auth/register/', { method: 'POST', body: JSON.stringify(data), auth: false }),
    me: () => apiFetch('/auth/me/'),
  },
  store: {
    products: (params?: string) => apiFetch(`/store/products/${params ? `?${params}` : ''}`, { auth: false }),
    product: (slug: string) => apiFetch(`/store/products/${slug}/`, { auth: false }),
    categories: () => apiFetch('/store/categories/', { auth: false }),
    cart: () => apiFetch('/store/cart/'),
    orders: () => apiFetch('/store/orders/'),
  },
  admin: {
    stats: () => apiFetch('/store/orders/stats/'),
    products: {
      list: () => apiFetch('/store/products/'),
      create: (data: any) => apiFetch('/store/products/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: any) => apiFetch(`/store/products/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: number) => apiFetch(`/store/products/${id}/`, { method: 'DELETE' }),
    },
    users: {
      list: () => apiFetch('/auth/management/'),
      toggleActive: (id: number) => apiFetch(`/auth/management/${id}/toggle_active/`, { method: 'POST' }),
    }
  }
}
