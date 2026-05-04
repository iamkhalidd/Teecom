"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Eye, CheckCircle, Truck, ShoppingBag, Download, CheckSquare, Square, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState("")

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.orders.list()
      setOrders(data)
    } catch (err) {
      console.error("Failed to fetch orders", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredOrders.map(o => o.id))
    }
  }

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedIds.length === 0) return

    try {
      await api.orders.bulkUpdate({ ids: selectedIds, action, value })
      setSelectedIds([])
      fetchOrders()
    } catch (err) {
      alert("Bulk action failed")
    }
  }

  const exportToCSV = () => {
    const ordersToExport = selectedIds.length > 0
      ? orders.filter(o => selectedIds.includes(o.id))
      : orders

    const headers = ["Order Number", "Date", "Customer", "Total", "Status", "Payment Status"]
    const rows = ordersToExport.map(o => [
      o.order_number, o.created_at, o.user_email || '', o.total, o.status, o.payment_status
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredOrders = orders.filter(o =>
    o.order_number.toLowerCase().includes(search.toLowerCase()) ||
    o.user_email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Monitor and update customer orders.</p>
        </div>
        <Button variant="outline" className="rounded-full gap-2 px-6 border-none shadow-sm bg-white" onClick={exportToCSV}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-10 rounded-xl border-none shadow-sm h-12 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl h-12 gap-2 border-none shadow-sm bg-white">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-primary/5 p-4 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 border border-primary/10">
          <div className="flex items-center gap-4 ml-2">
            <span className="text-sm font-bold text-primary">{selectedIds.length} orders selected</span>
            <div className="h-4 w-px bg-primary/20" />
            <Select onValueChange={(val) => handleBulkAction('status', val)}>
              <SelectTrigger className="w-[180px] h-9 border-none bg-white rounded-lg shadow-sm font-semibold text-xs">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="processing">Mark Processing</SelectItem>
                <SelectItem value="shipped">Mark Shipped</SelectItem>
                <SelectItem value="delivered">Mark Delivered</SelectItem>
                <SelectItem value="cancelled">Cancel Selected</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(val) => handleBulkAction('payment_status', val)}>
              <SelectTrigger className="w-[180px] h-9 border-none bg-white rounded-lg shadow-sm font-semibold text-xs">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Mark Paid</SelectItem>
                <SelectItem value="pending">Mark Pending</SelectItem>
                <SelectItem value="refunded">Mark Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
             <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 h-9 rounded-lg font-bold text-xs px-4"
                onClick={() => handleBulkAction('cancel')}
              >
                <XCircle className="h-4 w-4 mr-2" /> Cancel Selected
              </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="px-4 flex items-center gap-4 text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-[-8px]">
             <div className="w-6 cursor-pointer" onClick={toggleSelectAll}>
                {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
             </div>
             <div className="flex-1">Order Details</div>
             <div className="w-24 text-center">Items</div>
             <div className="w-32 text-center">Total</div>
             <div className="w-32 text-center">Status</div>
             <div className="w-24"></div>
          </div>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm group transition-all border ${selectedIds.includes(order.id) ? 'border-primary/30 ring-1 ring-primary/5' : 'border-transparent hover:border-border'}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="w-6 cursor-pointer flex-shrink-0"
                  onClick={() => toggleSelect(order.id)}
                >
                  {selectedIds.includes(order.id) ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  )}
                </div>
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                   <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Order #{order.order_number}</h3>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-24 text-center">
                  <p className="font-bold text-sm">{order.items?.length || 0}</p>
                </div>
                <div className="w-32 text-center">
                  <p className="font-bold text-sm">${order.total}</p>
                </div>
                <div className="w-32 text-center">
                  <Badge
                    className={`rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'delivered' || order.status === 'paid' ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' :
                      order.status === 'cancelled' || order.status === 'refunded' ? 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/20' :
                      'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20'
                    }`}
                    variant="outline"
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="w-24 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <Eye className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-success">
                      <CheckCircle className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-border text-muted-foreground">
               No orders found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
