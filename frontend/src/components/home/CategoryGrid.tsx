"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Shirt, Footprints, Briefcase, Smartphone, Watch, Gem, Utensils, Baby, Package } from "lucide-react"

// Map category names to icons (fallback to Package)
const iconMap: Record<string, any> = {
  clothes: Shirt,
  clothing: Shirt,
  shoes: Footprints,
  footwear: Footprints,
  bags: Briefcase,
  electronics: Smartphone,
  watch: Watch,
  watches: Watch,
  jewelry: Gem,
  jewellery: Gem,
  kitchen: Utensils,
  toys: Baby,
}

function getIconForCategory(name: string) {
  const key = name.toLowerCase()
  return iconMap[key] || Package
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await api.products.categories()
        setCategories(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        console.error("Failed to fetch categories", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Categories</h2>
        </div>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Link href="/products" className="text-sm font-semibold hover:underline">
          See All
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
        {categories.slice(0, 8).map((category) => {
          const Icon = getIconForCategory(category.name)
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-transform group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold">{category.name}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
