"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

interface CartContextType {
  cart: any
  loading: boolean
  addItem: (productId: number, quantity: number, size?: string, color?: string) => Promise<void>
  updateItem: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  refreshCart: () => Promise<void>
  subtotal: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null)
      setLoading(false)
      return
    }
    try {
      const carts = await api.store.cart()
      if (carts.length > 0) {
        setCart(carts[0])
      } else {
        // Handle no cart case if needed
        setCart(null)
      }
    } catch (err) {
      console.error("Failed to fetch cart", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addItem = async (productId: number, quantity: number, size?: string, color?: string) => {
    // This logic depends on your backend implementation (POST /store/cart/items/ etc)
    // For now assuming a simplified version
    await apiFetch('/store/cart/', {
        method: 'POST',
        body: JSON.stringify({ product: productId, quantity, size, color })
    })
    await refreshCart()
  }

  const updateItem = async (itemId: number, quantity: number) => {
    await apiFetch(`/store/cart/${itemId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity })
    })
    await refreshCart()
  }

  const removeItem = async (itemId: number) => {
    await apiFetch(`/store/cart/${itemId}/`, { method: 'DELETE' })
    await refreshCart()
  }

  const subtotal = cart?.items?.reduce((acc: number, item: any) => acc + (parseFloat(item.price_snapshot) * item.quantity), 0) || 0
  const total = subtotal // Add shipping/tax logic if needed

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, refreshCart, subtotal, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Re-using apiFetch internally for quick implementation
async function apiFetch(endpoint: string, options: any = {}) {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    })
    if (!response.ok) throw new Error('API request failed')
    return response.json().catch(() => ({}))
}
