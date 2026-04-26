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
      const cartData = await api.carts.get()
      setCart(cartData)
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
    await api.carts.addItem({ product: productId, quantity, size, color })
    await refreshCart()
  }

  const updateItem = async (itemId: number, quantity: number) => {
    await api.carts.updateItem(itemId, { quantity })
    await refreshCart()
  }

  const removeItem = async (itemId: number) => {
    await api.carts.removeItem(itemId)
    await refreshCart()
  }

  const subtotal = cart?.items?.reduce((acc: number, item: any) => acc + (parseFloat(item.price_snapshot) * item.quantity), 0) || 0
  const total = subtotal

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
