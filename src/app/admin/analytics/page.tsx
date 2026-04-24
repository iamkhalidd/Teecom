import {
  BarChart,
  LineChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your store's performance.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Average Order Value</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold">$124.50</h3>
              <div className="flex items-center gap-1 text-sm text-success font-medium mb-1">
                <ArrowUpRight className="h-4 w-4" />
                +5.2%
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold">3.24%</h3>
              <div className="flex items-center gap-1 text-sm text-destructive font-medium mb-1">
                <ArrowDownRight className="h-4 w-4" />
                -0.4%
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Customer Acquisition Cost</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold">$42.00</h3>
              <div className="flex items-center gap-1 text-sm text-success font-medium mb-1">
                <ArrowDownRight className="h-4 w-4" />
                -12.1%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-muted/30 m-6 mt-0 rounded-2xl">
            <LineChart className="h-12 w-12 text-muted-foreground/50" />
            <span className="ml-4 text-muted-foreground font-medium">Sales Chart Visualization</span>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-muted/30 m-6 mt-0 rounded-2xl">
            <PieChart className="h-12 w-12 text-muted-foreground/50" />
            <span className="ml-4 text-muted-foreground font-medium">Category Chart Visualization</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { source: "Direct", value: "45%", color: "bg-primary" },
              { source: "Social Media", value: "25%", color: "bg-muted-foreground" },
              { source: "Email", value: "15%", color: "bg-muted" },
              { source: "Referral", value: "10%", color: "bg-secondary" },
              { source: "Other", value: "5%", color: "bg-border" },
            ].map((item) => (
              <div key={item.source} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{item.source}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full", item.color)} style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
