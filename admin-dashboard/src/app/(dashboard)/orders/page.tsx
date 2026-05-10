"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, CheckCircle, Truck, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await api.orders.list()
        setOrders(data)
      } catch (err) {
        console.error("Failed to fetch orders", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])


  const handleBulkAction = async (action: string, value?: any) => {
    try {
      await api.orders.bulkUpdate({ ids: selectedIds, action, value })
      toast.success('Bulk action successful')
      setSelectedIds([])
      // Refresh orders
      const data = await api.orders.list()
      setOrders(data)
    } catch (err) {
      toast.error('Bulk action failed')
    }
  }

  return (
    <div className="relative">
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Monitor and update customer orders.</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-10 rounded-xl border-none shadow-sm h-12" />
        </div>
        <Button variant="outline" className="rounded-xl h-12 gap-2 border-none shadow-sm" onClick={() => window.open(process.env.NEXT_PUBLIC_API_URL + "/orders/export_csv/", "_blank")}>
          <Download className="h-4 w-4" /> Export
        </Button>
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
          {orders.map((order) => (
            <div key={order.id} className={}>
              <div className="flex items-center gap-4">
                <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" checked={selectedIds.includes(order.id)} onChange={() => toggleSelection(order.id)} />
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                   <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Order #{order.order_number}</h3>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Items</p>
                  <p className="font-bold">{order.items?.length || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total</p>
                  <p className="font-bold">${order.total}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Status</p>
                  <Badge className="rounded-full">
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="rounded-full">
                      <Eye className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="rounded-full text-success">
                      <CheckCircle className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-4">
          <span className="text-sm font-bold">{selectedIds.length} orders selected</span>
          <div className="h-6 w-px bg-primary-foreground/20" />
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleBulkAction('status', 'processing')}>Mark Processing</Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkAction('status', 'shipped')}>Mark Shipped</Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkAction('cancel')}>Cancel</Button>
          </div>
          <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setSelectedIds([])}>Cancel</Button>
        </div>
      )}
    </div>
  )
}

function ShoppingBag(props: any) {

  const handleBulkAction = async (action: string, value?: any) => {
    try {
      await api.orders.bulkUpdate({ ids: selectedIds, action, value })
      toast.success('Bulk action successful')
      setSelectedIds([])
      // Refresh orders
      const data = await api.orders.list()
      setOrders(data)
    } catch (err) {
      toast.error('Bulk action failed')
    }
  }

  return (
    <div className="relative">
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

    </div>