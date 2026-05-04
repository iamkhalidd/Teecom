"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.admin.stats()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch stats", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-8 space-y-8"><Skeleton className="h-20 w-full" /></div>
  }

  const statCards = [
    {
      title: "Gross Revenue",
      value: `$${(stats?.gross_revenue || 0).toLocaleString()}`,
      icon: DollarSign, subtitle: "Lifetime",
    },
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      icon: ShoppingBag, subtitle: "All time",
    },
    {
      title: "Avg Order Value",
      value: `$${parseFloat(stats?.aov || 0).toFixed(2)}`,
      icon: Users, subtitle: "Per order",
    },
    {
      title: "Repeat Rate",
      value: `${(stats?.repeat_purchase_rate || 0).toFixed(1)}%`,
      icon: Package, subtitle: "Customer loyalty",
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => window.location.href='/orders'}>
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.recent_orders?.length === 0 && (
                <p className="text-muted-foreground text-sm">No recent orders.</p>
              )}
              {stats?.recent_orders?.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Order #{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${order.total}</p>
                    <p className={`text-[10px] uppercase font-bold ${order.status === 'paid' || order.status === 'delivered' ? 'text-success' : 'text-warning'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.top_products?.length === 0 && (
                <p className="text-muted-foreground text-sm">No product data yet.</p>
              )}
              {stats?.top_products?.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-semibold text-sm">{product.name}</span>
                  </div>
                  <span className="text-sm font-bold">{product.sales} sales</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
