import Link from "next/link"
import { ShoppingBag, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "ORD-7729",
    date: "Dec 15, 2024",
    status: "Delivered",
    total: 385.0,
    items: 1,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop",
    name: "Werolla Cardigans",
  },
  {
    id: "ORD-7728",
    date: "Dec 14, 2024",
    status: "Processing",
    total: 375.0,
    items: 1,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop",
    name: "Suga Leather Shoes",
  },
  {
    id: "ORD-7727",
    date: "Dec 12, 2024",
    status: "Cancelled",
    total: 550.0,
    items: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
    name: "Black Nike Shoes",
  },
]

export default function OrdersPage() {
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

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={order.image}
                    alt={order.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{order.name}</h3>
                      <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                    </div>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Processing"
                          ? "secondary"
                          : "destructive"
                      }
                      className="rounded-full"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${order.total.toFixed(2)}</span>
                    <Button variant="outline" size="sm" className="rounded-full">
                      Track Order
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
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
        )}
      </div>
    </div>
  )
}
