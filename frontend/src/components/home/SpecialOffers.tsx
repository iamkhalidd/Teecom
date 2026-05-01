"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function SpecialOffers() {
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOffers() {
      try {
        const data = await api.products.offers()
        setOffers(Array.isArray(data) ? data.slice(0, 4) : (data.results || []).slice(0, 4))
      } catch (err) {
        console.error("Failed to fetch special offers", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Special Offers</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40 rounded-3xl" />
          ))}
        </div>
      </section>
    )
  }

  if (offers.length === 0) return null

  const bgColors = ["bg-zinc-200", "bg-zinc-100", "bg-zinc-200", "bg-zinc-100"]

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Special Offers</h2>
        <Link href="/products" className="text-sm font-semibold hover:underline">
          See All
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {offers.map((offer, idx) => (
          <div
            key={offer.id || idx}
            className={`flex items-center justify-between overflow-hidden rounded-3xl p-8 ${bgColors[idx % bgColors.length]}`}
          >
            <div className="max-w-[60%]">
              <h3 className="mb-2 text-4xl font-bold">{offer.discount_percentage}%</h3>
              <h4 className="mb-2 text-xl font-bold">{offer.title}</h4>
              <p className="text-sm text-muted-foreground">{offer.description}</p>
            </div>
            {offer.image_url ? (
              <img src={offer.image_url} alt={offer.title} className="h-24 w-24 rounded-2xl object-cover" />
            ) : (
              <div className="h-24 w-24 rounded-2xl bg-white/40" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
