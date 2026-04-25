"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"

export default function ProductForm({ product, categories, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    discount_price: product?.discount_price || "",
    category: product?.category || "",
    brand: product?.brand || "",
    stock_quantity: product?.stock_quantity || 0,
    status: product?.status || "active",
    slug: product?.slug || "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (product) {
        await api.admin.products.update(product.id, formData)
      } else {
        // Auto-generate slug if empty
        if (!formData.slug) {
           formData.slug = formData.name.toLowerCase().replace(/ /g, '-')
        }
        await api.admin.products.create(formData)
      }
      onSuccess()
      onClose()
    } catch (err) {
      alert("Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
        <button onClick={onClose} className="absolute right-6 top-6 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Product Name</label>
              <Input
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="rounded-xl h-12" required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Slug</label>
              <Input
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="rounded-xl h-12" placeholder="auto-generated"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Description</label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="rounded-xl min-h-[100px]" required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Price ($)</label>
              <Input
                type="number" step="0.01"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="rounded-xl h-12" required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Discount Price ($)</label>
              <Input
                type="number" step="0.01"
                value={formData.discount_price}
                onChange={e => setFormData({...formData, discount_price: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Stock</label>
              <Input
                type="number"
                value={formData.stock_quantity}
                onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                className="rounded-xl h-12" required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full h-12 rounded-xl bg-muted px-4 outline-none text-sm font-medium" required
              >
                <option value="">Select Category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full h-12 rounded-xl bg-muted px-4 outline-none text-sm font-medium"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-full px-8">Cancel</Button>
            <Button type="submit" disabled={loading} className="rounded-full px-12 font-bold">
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
