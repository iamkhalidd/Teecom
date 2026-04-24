import { Package, Plus, Search, Filter, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    id: 1,
    name: "Suga Leather Shoes",
    category: "Shoes",
    price: "$375.00",
    stock: 45,
    status: "Active",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Werolla Cardigans",
    category: "Clothes",
    price: "$385.00",
    stock: 12,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Vinia Headphone",
    category: "Electronics",
    price: "$360.00",
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop",
  },
]

export default function AdminProducts() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your store's inventory.</p>
        </div>
        <Button className="rounded-full h-12 px-6 gap-2">
          <Plus className="h-5 w-5" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input className="pl-10 h-12 rounded-xl bg-white border-none shadow-sm" placeholder="Search products..." />
        </div>
        <Button variant="outline" className="h-12 rounded-xl bg-white border-none shadow-sm gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 flex-1 md:justify-end">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Price</p>
                    <p className="font-bold">{product.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Stock</p>
                    <p className="font-bold">{product.stock} items</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Status</p>
                    <Badge variant={product.status === "Active" ? "default" : product.status === "Low Stock" ? "secondary" : "destructive"} className="rounded-full">
                      {product.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
