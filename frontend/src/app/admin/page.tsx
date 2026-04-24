import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
  {
    title: "Total Revenue",
    value: "$128,430",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Total Orders",
    value: "2,345",
    change: "+18.2%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "Active Customers",
    value: "1,203",
    change: "-3.1%",
    trend: "down",
    icon: Users,
  },
  {
    title: "Products",
    value: "456",
    change: "+4.3%",
    trend: "up",
    icon: Package,
  },
]

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div>
                      <p className="font-semibold text-sm">Customer #{1024 + i}</p>
                      <p className="text-xs text-muted-foreground">2 mins ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">$245.00</p>
                    <p className="text-[10px] uppercase font-bold text-success">Paid</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Top Products</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted" />
                    <div>
                      <p className="font-semibold text-sm">Product Name {i}</p>
                      <p className="text-xs text-muted-foreground">124 sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">$1,200.00</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">In Stock</p>
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
