"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, History, AlertTriangle, ArrowUpDown, Package, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function InventoryPage() {
  const [movements, setMovements] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any>({ products: [], variants: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchInventoryData = useCallback(async () => {
    setLoading(true)
    try {
      const [movementsData, lowStockData] = await Promise.all([
        api.admin.inventory.list(),
        api.admin.inventory.lowStock()
      ])
      setMovements(movementsData)
      setLowStock(lowStockData)
    } catch (err) {
      console.error("Failed to fetch inventory data", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInventoryData()
  }, [fetchInventoryData])

  const filteredMovements = movements.filter(m =>
    m.product_name.toLowerCase().includes(search.toLowerCase()) ||
    m.reason?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">Manage stock levels and track movements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{lowStock.products.length + lowStock.variants.length}</span>
              <AlertTriangle className={`h-5 w-5 ${lowStock.products.length + lowStock.variants.length > 0 ? 'text-danger' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>
        {/* Add more metric cards if needed */}
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <History className="h-4 w-4 mr-2" /> Movement History
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <AlertTriangle className="h-4 w-4 mr-2" /> Low Stock Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movements..."
                className="pl-10 rounded-xl border-none shadow-sm h-12 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  <th className="p-4 font-semibold text-sm">Product</th>
                  <th className="p-4 font-semibold text-sm">Type</th>
                  <th className="p-4 font-semibold text-sm text-right">Change</th>
                  <th className="p-4 font-semibold text-sm text-right">Stock After</th>
                  <th className="p-4 font-semibold text-sm">Reason</th>
                  <th className="p-4 font-semibold text-sm">User</th>
                  <th className="p-4 font-semibold text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td colSpan={7} className="p-4"><Skeleton className="h-6 w-full" /></td>
                    </tr>
                  ))
                ) : filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground">
                      No inventory movements found.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((movement) => (
                    <tr key={movement.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-sm">{movement.product_name}</div>
                        {movement.variant_name && <div className="text-xs text-muted-foreground">{movement.variant_name}</div>}
                      </td>
                      <td className="p-4 capitalize">
                        <Badge variant="outline" className="font-normal text-[10px] uppercase">
                          {movement.type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className={`p-4 text-sm font-bold text-right ${movement.quantity_change > 0 ? 'text-success' : 'text-danger'}`}>
                        {movement.quantity_change > 0 ? `+${movement.quantity_change}` : movement.quantity_change}
                      </td>
                      <td className="p-4 text-sm font-medium text-right">{movement.new_quantity}</td>
                      <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{movement.reason}</td>
                      <td className="p-4 text-sm">{movement.user_email || 'System'}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(movement.created_at).toLocaleDateString()} {new Date(movement.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : lowStock.products.length === 0 && lowStock.variants.length === 0 ? (
              <Card className="border-none shadow-sm p-12 text-center text-muted-foreground">
                All items are well stocked.
              </Card>
            ) : (
              <>
                {lowStock.products.map((product: any) => (
                  <Card key={product.id} className="border-none shadow-sm border-l-4 border-l-danger">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-bold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Global Stock</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                           <span className="text-sm text-muted-foreground">Threshold: {product.low_stock_threshold}</span>
                           <Badge variant="destructive" className="bg-danger/10 text-danger border-none">
                            {product.stock_quantity} left
                           </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2 text-xs h-8 gap-1">
                          <PlusCircle className="h-3 w-3" /> Restock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {lowStock.variants.map((variant: any) => (
                  <Card key={variant.id} className="border-none shadow-sm border-l-4 border-l-warning">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-bold">{variant.product_name || 'Variant'}</p>
                          <p className="text-sm text-muted-foreground">{variant.size} / {variant.color} - SKU: {variant.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                           <span className="text-sm text-muted-foreground">Threshold: {variant.low_stock_threshold}</span>
                           <Badge variant="destructive" className="bg-warning/10 text-warning border-none">
                            {variant.stock_quantity} left
                           </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2 text-xs h-8 gap-1">
                          <PlusCircle className="h-3 w-3" /> Restock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
