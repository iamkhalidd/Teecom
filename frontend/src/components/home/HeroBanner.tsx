"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface Banner {
  id: number
  title: string
  subtitle: string
  image_url: string
  image_alt?: string
  cta_text: string
  cta_link: string
  is_active: boolean
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.content.banners()
        const now = new Date()
        const activeBanners = (res.results || res).filter((b: any) => {
          if (!b.is_active) return false
          if (b.start_date && new Date(b.start_date) > now) return false
          if (b.end_date && new Date(b.end_date) < now) return false
          return true
        })
        setBanners(activeBanners)
      } catch (error) {
        console.error("Failed to fetch banners", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </section>
    )
  }

  // Fallback to default if no active banners
  const banner = banners.length > 0 ? banners[0] : {
    title: "Today's Special Offer",
    subtitle: "Get up to 30% discount on every order, only valid for today.",
    image_url: "",
    image_alt: "Special Offer Banner",
    cta_text: "Shop Now",
    cta_link: "/products"
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div
        className="relative overflow-hidden rounded-3xl bg-[#E5E5E5] px-8 py-12 md:px-16 md:py-20"
        style={banner.image_url ? {
          backgroundImage: `linear-gradient(to right, rgba(229,229,229,1) 0%, rgba(229,229,229,0.8) 50%, rgba(229,229,229,0) 100%), url(${banner.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="relative z-10 max-w-lg">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Featured
          </h2>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl text-gray-900">
            {banner.title}
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            {banner.subtitle}
          </p>
          <Link href={banner.cta_link || "/products"}>
            <Button size="lg" className="rounded-full px-8 h-12">
              {banner.cta_text || "Shop Now"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
