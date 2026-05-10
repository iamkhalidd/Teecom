"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Search,
  Eye,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Globe,
  Smartphone,
  Calendar,
  Filter,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  Activity
} from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { toast } from "sonner"
import { format } from "date-fns"

interface SearchQuery {
  id: number
  query: string
  results_count: number
  created_at: string
}

export default function TrafficPage() {
  const [searches, setSearches] = useState<SearchQuery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await api.admin.traffic.searches()
      setSearches(data)
    } catch (error) {
      console.error("Failed to fetch traffic data", error)
      toast.error("Failed to load traffic data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Traffic & Conversions</h2>
          <p className="text-muted-foreground mt-1">Analyze how customers find and interact with your store.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button >
            <TrendingUp className="h-4 w-4 mr-2" />
            Conversion Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              18%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Store Visits</p>
          <h3 className="text-2xl font-bold mt-1">12,480</h3>
          <p className="text-xs text-muted-foreground mt-2">Past 30 days</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Conversion Rate</p>
          <h3 className="text-2xl font-bold mt-1">3.24%</h3>
          <p className="text-xs text-muted-foreground mt-2">Avg. checkout completion</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Search className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Top Search Term</p>
          <h3 className="text-2xl font-bold mt-1">"{searches[0]?.query || 'N/A'}"</h3>
          <p className="text-xs text-muted-foreground mt-2">Most frequent query</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Product Views</p>
          <h3 className="text-2xl font-bold mt-1">45,120</h3>
          <p className="text-xs text-muted-foreground mt-2">Total item impressions</p>
        </Card>
      </div>

      <Tabs defaultValue="searches" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="searches" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Search className="h-4 w-4 mr-2" />
            Search Queries
          </TabsTrigger>
          <TabsTrigger value="pages" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Globe className="h-4 w-4 mr-2" />
            Top Pages
          </TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Smartphone className="h-4 w-4 mr-2" />
            Devices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="searches">
           <Card className="p-0 overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
               <h3 className="font-bold text-sm">Recent Search Activity</h3>
               <Button variant="ghost" size="sm">Export CSV</Button>
             </div>
             <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-100">
                 <tr>
                   <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Search Query</th>
                   <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Results</th>
                   <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                   <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {loading ? (
                    [1, 2, 3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                      </tr>
                    ))
                 ) : searches.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">No search data yet.</td>
                    </tr>
                 ) : (
                   searches.map(s => (
                     <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-6 py-4 font-medium">"{s.query}"</td>
                       <td className="px-6 py-4">
                         <Badge variant={s.results_count === 0 ? "destructive" : "secondary"}>
                           {s.results_count} products
                         </Badge>
                       </td>
                       <td className="px-6 py-4 text-sm text-muted-foreground">
                         {format(new Date(s.created_at), "PPp")}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <Button variant="ghost" size="icon">
                           <ExternalLink className="h-4 w-4" />
                         </Button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </Card>
        </TabsContent>

        <TabsContent value="pages">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Most Visited Products
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Premium Leather Jacket", views: "4,240", rate: "12%" },
                    { name: "Classic Cotton Tee", views: "3,120", rate: "8%" },
                    { name: "Minimalist Watch", views: "2,840", rate: "7%" },
                    { name: "Canvas Tote Bag", views: "1,920", rate: "5%" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                        <p className="text-sm font-medium">{p.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{p.views}</p>
                        <p className="text-[10px] text-muted-foreground">{p.rate} of total</p>
                      </div>
                    </div>
                  ))}
                </div>
             </Card>

             <Card className="p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Top Locations
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "United States", visits: "6,240", rate: "50%" },
                    { name: "United Kingdom", visits: "1,120", rate: "9%" },
                    { name: "Germany", visits: "840", rate: "7%" },
                    { name: "Canada", visits: "620", rate: "5%" },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <p className="text-sm font-medium">{l.name}</p>
                      <div className="text-right">
                        <p className="text-sm font-bold">{l.visits}</p>
                        <p className="text-[10px] text-muted-foreground">{l.rate}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
