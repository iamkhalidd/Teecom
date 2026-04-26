"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/products/ProductCard"
import ProductFilters from "@/components/products/ProductFilters"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.products.list()
        setProducts(data)
      } catch (err) {
        console.error("Failed to fetch products", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-64 flex-shrink-0">
          <ProductFilters />
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">All Products ({products.length})</h1>
            <select className="bg-transparent text-sm font-semibold outline-none">
              <option>Popular</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
              {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
