"use client"

import { useState } from "react"
import Link from "next/link"
import ProductCard from "@/components/products/ProductCard"
import { cn } from "@/lib/utils"

const filters = ["All", "Clothes", "Shoes", "Bags", "Electronics", "Watch", "Jewelry"]

const products = [
  { id: "1", name: "Snake Leather Bag", price: 445, rating: 4.5, sales: 9374, image: "" },
  { id: "2", name: "Suga Leather Shoes", price: 375, rating: 4.7, sales: 7440, image: "" },
  { id: "3", name: "Leather Casual Suit", price: 420, rating: 4.3, sales: 6927, image: "" },
  { id: "4", name: "Black Leather Bag", price: 765, rating: 4.9, sales: 8094, image: "" },
  { id: "5", name: "Airtight Microphone", price: 390, rating: 4.6, sales: 6843, image: "" },
  { id: "6", name: "Black Nike Shoes", price: 550, rating: 4.5, sales: 7758, image: "" },
]

export default function PopularProducts() {
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Most Popular</h2>
        <Link href="/products" className="text-sm font-semibold hover:underline">
          See All
        </Link>
      </div>

      <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "whitespace-nowrap rounded-full border-2 px-6 py-2 text-sm font-bold transition-colors",
              activeFilter === filter
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary hover:bg-secondary"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  )
}
