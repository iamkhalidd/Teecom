"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, Shield, UserX, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await api.admin.users.list()
        setUsers(data)
      } catch (err) {
        console.error("Failed to fetch users", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const toggleUserActive = async (id: number) => {
    try {
      const response = await api.admin.users.toggleActive(id)
      setUsers(users.map(u => u.id === id ? { ...u, is_active: response.is_active } : u))
    } catch (err) {
      alert("Failed to toggle user status")
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your store's user base.</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-10 rounded-xl border-none shadow-sm h-12" />
        </div>
        <Button variant="outline" className="rounded-xl h-12 gap-2 border-none shadow-sm">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-card p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-bold">
                  {user.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold">{user.full_name}</h3>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Role</p>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="rounded-full">
                    {user.role}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Status</p>
                  <Badge variant={user.is_active ? 'outline' : 'destructive'} className="rounded-full">
                    {user.is_active ? 'Active' : 'Blocked'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="rounded-full" onClick={() => toggleUserActive(user.id)}>
                      {user.is_active ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-success" />}
                   </Button>
                   <Button variant="ghost" size="icon" className="rounded-full">
                      <Shield className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
