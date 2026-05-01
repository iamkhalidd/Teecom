"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/products/ProductCard"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function PopularProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.products.list("ordering=-created_at"),
          api.products.categories()
        ])
        setProducts(Array.isArray(productsData) ? productsData : productsData.results || [])
        const cats = Array.isArray(categoriesData) ? categoriesData : categoriesData.results || []
        setCategories(cats)
      } catch (err) {
        console.error("Failed to fetch popular products", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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

  // Filter products by selected category
  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(p => p.category === parseInt(activeCategory))

  // Build category tabs from real data
  const categoryTabs = [
    { id: "all", name: "All" },
    ...categories.slice(0, 4).map(c => ({ id: String(c.id), name: c.name }))
  ]

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Most Popular</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categoryTabs.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
        {filteredProducts.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
