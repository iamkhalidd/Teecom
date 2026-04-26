"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
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
      title: "Total Revenue",
      value: `$${stats?.total_revenue?.toLocaleString() || 0}`,
      change: "+12.5%", // Demo change
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      change: "+18.2%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Active Customers",
      value: stats?.total_customers?.toLocaleString() || 0,
      change: `+${stats?.new_customers_30d || 0}`,
      trend: "up",
      icon: Users,
    },
    {
      title: "Recent Orders (30d)",
      value: stats?.recent_orders_30d?.toLocaleString() || 0,
      change: "+4.3%", // Placeholder trend
      trend: "up",
      icon: Package,
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`}>
                  {stat.change}
                  {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.recent_orders?.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div>
                      <p className="font-semibold text-sm">Order #{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${order.total}</p>
                    <p className={`text-[10px] uppercase font-bold ${order.status === 'paid' ? 'text-success' : 'text-warning'}`}>
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
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 gap-4">
                <Button className="rounded-2xl h-20 flex flex-col gap-1" variant="outline" onClick={() => window.location.href='/admin/products'}>
                   <Package className="h-5 w-5" />
                   <span>Add Product</span>
                </Button>
                <Button className="rounded-2xl h-20 flex flex-col gap-1" variant="outline" onClick={() => window.location.href='/admin/orders'}>
                   <ShoppingBag className="h-5 w-5" />
                   <span>View Orders</span>
                </Button>
                <Button className="rounded-2xl h-20 flex flex-col gap-1" variant="outline" onClick={() => window.location.href='/admin/customers'}>
                   <Users className="h-5 w-5" />
                   <span>Manage Users</span>
                </Button>
                <Button className="rounded-2xl h-20 flex flex-col gap-1" variant="outline">
                   <DollarSign className="h-5 w-5" />
                   <span>Payouts</span>
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
