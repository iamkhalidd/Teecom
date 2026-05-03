"use client"

import { useState, useEffect } from "react"
import { Download, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.admin.stats()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch analytics", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  const totalOrders = stats?.total_orders || 0
  const totalRevenue = stats?.total_revenue || 0
  const totalCustomers = stats?.total_customers || 0
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Your store's performance overview.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Overview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Average Order Value</p>
            <h3 className="text-3xl font-bold">${avgOrderValue}</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold">${totalRevenue.toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Customers</p>
            <h3 className="text-3xl font-bold">{totalCustomers.toLocaleString()}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Orders Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/30">
                <span className="font-medium">Total Orders</span>
                <span className="font-bold text-lg">{totalOrders}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/30">
                <span className="font-medium">Orders (Last 30 days)</span>
                <span className="font-bold text-lg">{stats?.recent_orders_30d || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/30">
                <span className="font-medium">New Customers (30d)</span>
                <span className="font-bold text-lg">{stats?.new_customers_30d || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.top_products?.length === 0 && (
                <p className="text-muted-foreground text-sm">No product data available.</p>
              )}
              {stats?.top_products?.map((product: any, idx: number) => (
                <div key={product.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{idx + 1}. {product.name}</span>
                    <span>{product.sales} sales</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${stats.top_products[0]?.sales ? (product.sales / stats.top_products[0].sales * 100) : 0}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
