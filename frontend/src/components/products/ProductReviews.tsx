"use client"

import { useState, useEffect } from "react"
import { Star, User } from "lucide-react"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await api.reviews.list(productId)
        setReviews(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [productId])

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-secondary/30">
        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="p-6 rounded-3xl bg-white shadow-sm border border-border/50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">{review.user_email?.split('@')[0] || "Anonymous"}</p>
                <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  )
}
