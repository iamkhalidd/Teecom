"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare, CheckCircle2, User } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

interface Review {
  id: number
  user_full_name: string
  rating: number
  comment: string
  admin_reply: string | null
  replied_at: string | null
  created_at: string
}

export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const data = await api.reviews.list(productId)
      setReviews(data)
    } catch (err) {
      console.error("Failed to fetch reviews", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please login to leave a review")
      return
    }

    try {
      setSubmitting(true)
      await api.reviews.create({
        product: productId,
        rating,
        comment
      })
      toast.success("Review submitted! It will appear after moderation.")
      setComment("")
      setRating(5)
    } catch (err) {
      toast.error("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-4 w-4 ${s <= count ? "fill-primary text-primary" : "text-gray-300"} ${
              interactive ? "cursor-pointer transition-transform hover:scale-110" : ""
            }`}
            onClick={() => interactive && setRating(s)}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
      <div className="h-20 bg-gray-100 rounded"></div>
    </div>
  }

  return (
    <div className="mt-16 border-t border-gray-100 pt-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Review Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl font-bold">
              {reviews.length > 0
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : "0.0"}
            </div>
            <div>
              {renderStars(Math.round(reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0))}
              <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</p>
            </div>
          </div>

          {user ? (
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-2xl">
              <h3 className="font-bold">Write a review</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                {renderStars(rating, true)}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Comment</label>
                <Textarea
                  placeholder="Tell us what you think about this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          ) : (
            <div className="bg-gray-50 p-6 rounded-2xl text-center">
              <p className="text-sm text-gray-600 mb-4">You must be logged in to write a review.</p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/login">Login to Review</a>
              </Button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <MessageSquare className="h-8 w-8 text-gray-300 mb-3" />
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{review.user_full_name}</h4>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-[10px] text-gray-400">
                          {format(new Date(review.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Purchase
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 pl-13">
                  {review.comment}
                </p>

                {review.admin_reply && (
                  <div className="ml-13 p-4 bg-gray-50 rounded-xl border-l-2 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Store Response</span>
                      <span className="text-[10px] text-gray-400">
                        {review.replied_at && format(new Date(review.replied_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 italic">
                      {review.admin_reply}
                    </p>
                  </div>
                )}
                <div className="h-px bg-gray-100 w-full mt-8 group-last:hidden" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
