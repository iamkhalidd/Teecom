"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2, Ticket, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const data = await apiFetch('/store/coupons/')
        setCoupons(data)
      } catch (err) {
        console.error("Failed to fetch coupons", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCoupons()
  }, [])

  const deleteCoupon = async (id: number) => {
    if (confirm("Delete this coupon?")) {
        await apiFetch(`/store/coupons/${id}/`, { method: 'DELETE' })
        setCoupons(coupons.filter(c => c.id !== id))
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Manage discount codes and promotions.</p>
        </div>
        <Button className="rounded-full gap-2 px-6">
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-40 w-full rounded-2xl" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-card p-6 rounded-[2rem] shadow-sm border border-border/50 relative overflow-hidden group">
               <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                     <Ticket className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant={coupon.is_active ? 'default' : 'secondary'} className="rounded-full">
                     {coupon.is_active ? 'Active' : 'Inactive'}
                  </Badge>
               </div>

               <div>
                  <h3 className="text-xl font-bold mb-1">{coupon.code}</h3>
                  <div className="flex items-center gap-2 text-success font-bold text-sm mb-4">
                     <Percent className="h-4 w-4" />
                     {coupon.discount_percentage}% OFF
                  </div>
               </div>

               <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-dashed">
                  <span>Used: {coupon.used_count}/{coupon.usage_limit}</span>
                  <button onClick={() => deleteCoupon(coupon.id)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 className="h-4 w-4" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

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
    if (response.status === 204) return null
    if (!response.ok) throw new Error('API request failed')
    return response.json().catch(() => ({}))
}
