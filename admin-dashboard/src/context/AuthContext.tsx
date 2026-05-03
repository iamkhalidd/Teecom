"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface AuthContextType {
  user: any
  loading: boolean
  login: (credentials: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('access_token')
      if (token === 'demo_token') {
        setUser({ full_name: 'Demo Admin', email: 'admin@demo.com', role: 'admin' })
        setLoading(false)
        return
      }
      if (token) {
        try {
          const userData = await api.auth.me()
          setUser(userData)
        } catch (err) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = async (credentials: any) => {
    // Demo bypass
    if (credentials.email === 'admin@demo.com' && credentials.password === 'demo') {
      localStorage.setItem('access_token', 'demo_token')
      setUser({ full_name: 'Demo Admin', email: 'admin@demo.com', role: 'admin' })
      return
    }

    const { access, refresh } = await api.auth.login(credentials)
    localStorage.setItem('access_token', access)
    if (refresh) {
      localStorage.setItem('refresh_token', refresh)
    }
    const userData = await api.auth.me()
    setUser(userData)
  }

  const register = async (data: any) => {
    await api.auth.register(data)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
