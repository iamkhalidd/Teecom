"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Plus, Edit, Trash2, Download, CheckSquare, Square, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import ProductForm from "@/components/admin/ProductForm"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState("")

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
    if (confirm("Are you sure you want to archive this product?")) {
      try {
        await api.admin.products.delete(id)
        fetchData()
      } catch (err) {
        alert("Failed to archive product")
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

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredProducts.map(p => p.id))
    }
  }

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedIds.length === 0) return

    try {
      if (action === 'delete') {
        if (confirm(`Are you sure you want to archive ${selectedIds.length} products?`)) {
          await api.admin.products.bulkDelete({ ids: selectedIds })
        } else return
      } else {
        await api.admin.products.bulkUpdate({ ids: selectedIds, action, value })
      }
      setSelectedIds([])
      fetchData()
    } catch (err) {
      alert("Bulk action failed")
    }
  }

  const exportToCSV = () => {
    const productsToExport = selectedIds.length > 0
      ? products.filter(p => selectedIds.includes(p.id))
      : products

    const headers = ["ID", "Name", "SKU", "Price", "Stock", "Status", "Category"]
    const rows = productsToExport.map(p => [
      p.id, p.name, p.sku || '', p.price, p.stock_quantity, p.status, p.category_name
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your store's inventory.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full gap-2 px-6 border-none shadow-sm" onClick={exportToCSV}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="rounded-full gap-2 px-6 shadow-lg shadow-primary/20" onClick={handleAdd}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10 rounded-xl border-none shadow-sm h-12 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl h-12 gap-2 border-none shadow-sm bg-white">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-primary/5 p-4 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 border border-primary/10">
          <div className="flex items-center gap-4 ml-2">
            <span className="text-sm font-bold text-primary">{selectedIds.length} products selected</span>
            <div className="h-4 w-px bg-primary/20" />
            <Select onValueChange={(val) => handleBulkAction('status', val)}>
              <SelectTrigger className="w-[180px] h-9 border-none bg-white rounded-lg shadow-sm font-semibold text-xs">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Set Active</SelectItem>
                <SelectItem value="draft">Set Draft</SelectItem>
                <SelectItem value="archived">Archive</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(val) => handleBulkAction('category', val)}>
              <SelectTrigger className="w-[180px] h-9 border-none bg-white rounded-lg shadow-sm font-semibold text-xs">
                <SelectValue placeholder="Move to Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-none bg-white rounded-lg shadow-sm font-semibold text-xs"
              onClick={() => {
                const amount = prompt("Enter amount to adjust price (use negative for discount, e.g. -10 or 5)")
                if (amount) handleBulkAction('price_adjust', amount)
              }}
            >
              Adjust Price
            </Button>
          </div>
          <div className="flex gap-2">
             <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 h-9 rounded-lg font-bold text-xs px-4"
                onClick={() => handleBulkAction('delete')}
              >
                <Archive className="h-4 w-4 mr-2" /> Archive Selected
              </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="px-4 flex items-center gap-4 text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-[-8px]">
             <div className="w-6 cursor-pointer" onClick={toggleSelectAll}>
                {selectedIds.length === filteredProducts.length ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
             </div>
             <div className="flex-1">Product Details</div>
             <div className="w-32 text-center">Price</div>
             <div className="w-32 text-center">Stock</div>
             <div className="w-32 text-center">Status</div>
             <div className="w-24"></div>
          </div>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm group transition-all border ${selectedIds.includes(product.id) ? 'border-primary/30 ring-1 ring-primary/5' : 'border-transparent hover:border-border'}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="w-6 cursor-pointer flex-shrink-0"
                  onClick={() => toggleSelect(product.id)}
                >
                  {selectedIds.includes(product.id) ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  )}
                </div>
                <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                  {product.images?.[0] && (
                    <img src={product.images[0].image_url} alt={product.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.category_name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-center">
                  <p className="font-bold text-sm">${product.price}</p>
                </div>
                <div className="w-32 text-center">
                  <p className={`text-sm font-bold ${product.stock_quantity <= (product.low_stock_threshold || 10) ? 'text-danger' : ''}`}>
                    {product.stock_quantity}
                  </p>
                </div>
                <div className="w-32 text-center">
                  <Badge
                    variant="outline"
                    className={`rounded-full text-[10px] font-bold uppercase ${
                      product.status === 'active' ? 'bg-success/10 text-success border-success/20' :
                      product.status === 'draft' ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {product.status}
                  </Badge>
                </div>
                <div className="w-24 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => deleteProduct(product.id)}>
                      <Archive className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-border text-muted-foreground">
               No products found matching your search.
            </div>
          )}
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
