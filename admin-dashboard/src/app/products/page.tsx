"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import ProductForm from "@/components/admin/ProductForm"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.admin.products.list(),
        api.products.categories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      console.error("Failed to fetch data", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const deleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.admin.products.delete(id)
        setProducts(products.filter(p => p.id !== id))
      } catch (err) {
        alert("Failed to delete product")
      }
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your store's inventory.</p>
        </div>
        <Button className="rounded-full gap-2 px-6" onClick={handleAdd}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10 rounded-xl border-none shadow-sm h-12" />
        </div>
        <Button variant="outline" className="rounded-xl h-12 gap-2 border-none shadow-sm">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-card p-4 rounded-2xl flex items-center justify-between shadow-sm group">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                  {product.images?.[0] && (
                    <img src={product.images[0].image_url} alt={product.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.category_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Price</p>
                  <p className="font-bold">${product.price}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Stock</p>
                  <p className="font-bold">{product.stock_quantity} items</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Status</p>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="rounded-full">
                    {product.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="rounded-full text-destructive" onClick={() => deleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}
