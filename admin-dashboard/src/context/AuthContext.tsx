"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface AuthContextType {
  user: any
  loading: boolean
  login: (credentials: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          const userData = await api.auth.me()
          setUser(userData)
        } catch (err) {
          localStorage.removeItem('access_token')
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = async (credentials: any) => {
    const { access } = await api.auth.login(credentials)
    localStorage.setItem('access_token', access)
    const userData = await api.auth.me()
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
