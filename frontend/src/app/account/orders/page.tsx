"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"

function getStatusVariant(status: string) {
  switch (status?.toLowerCase()) {
    case "delivered": return "default"
    case "paid":
    case "processing": return "secondary"
    case "shipped": return "outline"
    case "cancelled":
    case "refunded": return "destructive"
    default: return "secondary"
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await api.orders.list()
        setOrders(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        console.error("Failed to fetch orders", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/account">
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-6 w-6 rotate-180" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="mb-8 text-muted-foreground">
            Items you purchase will appear here.
          </p>
          <Link href="/products">
            <Button className="rounded-full px-8">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">Order #{order.order_number}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()} · {order.items?.length || 0} items
                        </p>
                      </div>
                      <Badge
                        variant={getStatusVariant(order.status) as any}
                        className="rounded-full"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">${parseFloat(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
