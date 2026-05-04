"use client"

import { useState, useEffect, useCallback } from "react"
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Repeat } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState("30")

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.admin.stats(`days=${days}`)
      setStats(data)
    } catch (err) {
      console.error("Failed to fetch analytics", err)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const exportReport = () => {
    if (!stats) return
    const csvRows = [
      ["Metric", "Value"],
      ["Gross Revenue", stats.gross_revenue],
      ["Net Revenue", stats.net_revenue],
      ["Total Orders", stats.total_orders],
      ["Average Order Value", stats.aov],
      ["Repeat Purchase Rate", `${stats.repeat_purchase_rate.toFixed(2)}%`],
      ["Refunds", stats.refunds],
      ["Discounts", stats.discounts],
      ["Shipping Fees", stats.shipping_fees]
    ]

    const csvContent = csvRows.map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `revenue_report_${days}d_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (loading && !stats) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    )
  }

  const COLORS = ['#111111', '#6B6B6B', '#E5E5E5', '#22C55E', '#EF4444']

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Dashboard</h1>
          <p className="text-muted-foreground">Track your store's financial performance.</p>
        </div>
        <div className="flex gap-3">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[180px] rounded-xl border-none shadow-sm bg-white font-semibold">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl border-none shadow-sm bg-white font-bold gap-2" onClick={exportReport}>
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign className="h-6 w-6" />
              </div>
              <Badge className="bg-success/10 text-success border-none">+{((stats?.gross_revenue / 1000) || 0).toFixed(1)}%</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Gross Revenue</p>
            <h3 className="text-2xl font-bold">${stats?.gross_revenue?.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                <TrendingUp className="h-6 w-6" />
              </div>
              <Badge className="bg-success/10 text-success border-none">Active</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold">{stats?.total_orders?.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Avg Order Value</p>
            <h3 className="text-2xl font-bold">${parseFloat(stats?.aov || 0).toFixed(2)}</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Repeat className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Repeat Rate</p>
            <h3 className="text-2xl font-bold">{stats?.repeat_purchase_rate?.toFixed(1)}%</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Revenue Over Time</CardTitle>
          <CardDescription>Daily revenue trends for the selected period.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.revenue_over_time}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111111" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{fontSize: 12, fill: '#6B6B6B'}}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{fontSize: 12, fill: '#6B6B6B'}}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                formatter={(val: any) => [`$${val}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#111111"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.top_products?.map((product: any, idx: number) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${product.revenue?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={stats?.revenue_by_category}
                   dataKey="revenue"
                   nameKey="name"
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                 >
                   {stats?.revenue_by_category?.map((entry: any, index: number) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip formatter={(val: any) => `$${val}`} />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-wrap justify-center gap-4 mt-4">
               {stats?.revenue_by_category?.map((cat: any, index: number) => (
                 <div key={cat.name} className="flex items-center gap-2">
                   <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                   <span className="text-xs font-medium">{cat.name}</span>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
