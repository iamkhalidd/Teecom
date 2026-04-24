import { ShoppingBag, Search, Filter, MoreVertical, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "#ORD-8829",
    customer: "Andrew Ainsley",
    date: "Dec 15, 2024",
    total: "$385.00",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#ORD-8828",
    customer: "Jane Cooper",
    date: "Dec 14, 2024",
    total: "$1,240.00",
    payment: "Paid",
    status: "Processing",
  },
  {
    id: "#ORD-8827",
    customer: "Guy Hawkins",
    date: "Dec 12, 2024",
    total: "$45.00",
    payment: "Pending",
    status: "Pending",
  },
]

export default function AdminOrders() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Monitor and manage customer orders.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input className="pl-10 h-12 rounded-xl bg-white border-none shadow-sm" placeholder="Search orders..." />
        </div>
        <Button variant="outline" className="h-12 rounded-xl bg-white border-none shadow-sm gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-bold text-sm">Order ID</th>
                <th className="px-6 py-4 font-bold text-sm">Customer</th>
                <th className="px-6 py-4 font-bold text-sm">Date</th>
                <th className="px-6 py-4 font-bold text-sm">Total</th>
                <th className="px-6 py-4 font-bold text-sm">Payment</th>
                <th className="px-6 py-4 font-bold text-sm">Status</th>
                <th className="px-6 py-4 font-bold text-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold">{order.id}</td>
                  <td className="px-6 py-4 text-sm">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-bold">{order.total}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={order.payment === "Paid" ? "default" : "secondary"} className="rounded-full">
                      {order.payment}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={order.status === "Delivered" ? "default" : order.status === "Processing" ? "secondary" : "outline"} className="rounded-full">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
