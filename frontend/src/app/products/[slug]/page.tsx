"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ProductGallery from "@/components/products/ProductGallery"
import ProductInfo from "@/components/products/ProductInfo"
import ProductReviews from "@/components/products/ProductReviews"
import PopularProducts from "@/components/home/PopularProducts"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"

export default function ProductDetailsPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await api.products.detail(slug as string)
        setProduct(data)
      } catch (err) {
        console.error("Failed to fetch product", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (loading) {
    return <div className="container mx-auto p-12"><Skeleton className="h-[600px] w-full" /></div>
  }

  if (!product) {
    return <div className="container mx-auto p-12 text-center">Product not found</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <ProductGallery images={product.images || []} />
            <ProductInfo product={product} />
          </div>

          <ProductReviews productId={product.id} />

          <div className="mt-20">
             <PopularProducts />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
