import { Users, Search, Filter, MoreVertical, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const customers = [
  {
    id: 1,
    name: "Andrew Ainsley",
    email: "andrew.ainsley@example.com",
    orders: 12,
    spent: "$2,450.00",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    orders: 5,
    spent: "$840.00",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    name: "Guy Hawkins",
    email: "guy.hawkins@example.com",
    orders: 1,
    spent: "$45.00",
    status: "Inactive",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
]

export default function AdminCustomers() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">View and manage your customer base.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input className="pl-10 h-12 rounded-xl bg-white border-none shadow-sm" placeholder="Search customers..." />
        </div>
        <Button variant="outline" className="h-12 rounded-xl bg-white border-none shadow-sm gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full overflow-hidden bg-muted">
                    <img src={customer.avatar} alt={customer.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold">{customer.name}</h3>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Orders</p>
                  <p className="font-bold">{customer.orders}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Spent</p>
                  <p className="font-bold">{customer.spent}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant={customer.status === "Active" ? "default" : "secondary"} className="rounded-full">
                  {customer.status}
                </Badge>
                <Button variant="outline" size="sm" className="rounded-full gap-2">
                  <Mail className="h-4 w-4" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
