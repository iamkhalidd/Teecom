"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import ProductCard from "@/components/products/ProductCard"
import CategoryGrid from "@/components/home/CategoryGrid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface ContentBlock {
  id: number
  block_type: 'featured_products' | 'categories' | 'text' | 'promotion'
  title?: string
  subtitle?: string
  content?: string
  image_url?: string
  image_alt?: string
  cta_text?: string
  cta_link?: string
  products_data?: any[]
  categories_data?: any[]
  is_active: boolean
}

export default function DynamicHomeContent() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        // The API call is api.content.blocks(), not api.content.blocks.list()
        const res = await api.content.blocks()
        const now = new Date()
        const activeBlocks = (Array.isArray(res) ? res : res.results || []).filter((b: any) => {
          if (!b.is_active) return false
          if (b.start_date && new Date(b.start_date) > now) return false
          if (b.end_date && new Date(b.end_date) < now) return false
          return true
        })
        setBlocks(activeBlocks)
      } catch (err) {
        console.error("Failed to fetch home content", err)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="space-y-12 py-12">
        {[1, 2].map(i => (
          <section key={i} className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(j => <Skeleton key={j} className="h-64 rounded-2xl" />)}
            </div>
          </section>
        ))}
      </div>
    )
  }

  // If no dynamic blocks, show default sections as fallback
  if (blocks.length === 0) {
    return (
      <>
        <CategoryGrid />
        {/* We can add more defaults here if needed */}
      </>
    )
  }

  return (
    <div className="space-y-16 py-12">
      {blocks.map((block) => {
        switch (block.block_type) {
          case 'featured_products':
            return (
              <section key={block.id} className="container mx-auto px-4">
                <div className="mb-8 text-center md:text-left">
                  <h2 className="text-3xl font-bold tracking-tight">{block.title || "Featured Products"}</h2>
                  {block.subtitle && <p className="text-muted-foreground mt-2">{block.subtitle}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                  {block.products_data?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )

          case 'categories':
            return (
              <section key={block.id} className="container mx-auto px-4">
                <div className="mb-8 text-center md:text-left">
                  <h2 className="text-3xl font-bold tracking-tight">{block.title || "Shop by Category"}</h2>
                  {block.subtitle && <p className="text-muted-foreground mt-2">{block.subtitle}</p>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {block.categories_data?.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className="group relative aspect-square overflow-hidden rounded-3xl bg-secondary"
                    >
                      {category.image_url && (
                         <img
                          src={category.image_url}
                          alt={category.name}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <span className="text-xl font-bold text-white">{category.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )

          case 'text':
            return (
              <section key={block.id} className="bg-secondary/30 py-20">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                  <h2 className="text-4xl font-bold mb-6">{block.title}</h2>
                  {block.subtitle && <p className="text-xl text-muted-foreground mb-8">{block.subtitle}</p>}
                  {block.content && (
                    <div className="prose prose-lg mx-auto whitespace-pre-wrap">
                      {block.content}
                    </div>
                  )}
                  {block.cta_link && (
                    <Button asChild size="lg" className="mt-10 rounded-full px-8">
                      <Link href={block.cta_link}>{block.cta_text || "Learn More"}</Link>
                    </Button>
                  )}
                </div>
              </section>
            )

          case 'promotion':
            return (
              <section key={block.id} className="container mx-auto px-4">
                <div
                  className="relative overflow-hidden rounded-[2rem] bg-black text-white min-h-[300px] flex items-center p-8 md:p-16"
                  aria-label={block.image_alt || block.title}
                  role="img"
                  style={block.image_url ? {
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url(${block.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}
                >
                  <div className="relative z-10 max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{block.title}</h2>
                    <p className="text-lg md:text-xl text-gray-300 mb-8">{block.subtitle}</p>
                    {block.cta_link && (
                      <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
                        <Link href={block.cta_link}>{block.cta_text || "Shop Now"}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </section>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
