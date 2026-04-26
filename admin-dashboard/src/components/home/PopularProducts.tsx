"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/products/ProductCard"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function PopularProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.products.list("limit=8&ordering=-created_at")
        setProducts(data)
      } catch (err) {
        console.error("Failed to fetch popular products", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Most Popular</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
           {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Most Popular</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Clothes", "Shoes", "Bags", "Electronics"].map((category) => (
            <button
              key={category}
              className="whitespace-nowrap rounded-full bg-secondary px-6 py-2 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
