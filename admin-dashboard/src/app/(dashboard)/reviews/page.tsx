"use client"

import { useState, useEffect } from "react"
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Reply,
  Trash2,
  ExternalLink,
  ShieldAlert
} from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { toast } from "sonner"
import Link from "next/link"

interface Review {
  id: number
  user_email: string
  user_full_name: string
  product_name: string
  product: number
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected" | "spam"
  admin_reply: string | null
  replied_at: string | null
  created_at: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    fetchReviews()
  }, [statusFilter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)

      const data = await api.admin.reviews.list(params.toString())
      setReviews(data)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
      toast.error("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: Review["status"]) => {
    try {
      await api.admin.reviews.update(id, { status })
      toast.success(`Review marked as ${status}`)
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return

    try {
      await api.admin.reviews.reply(id, { admin_reply: replyText })
      toast.success("Reply sent")
      setReplyingTo(null)
      setReplyText("")
      fetchReviews()
    } catch (error) {
      toast.error("Failed to send reply")
    }
  }

  const deleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      await api.admin.reviews.delete(id)
      toast.success("Review deleted")
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch (error) {
      toast.error("Failed to delete review")
    }
  }

  const filteredReviews = reviews.filter(review =>
    review.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: Review["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Rejected</Badge>
      case "spam":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">Spam</Badge>
      default:
        return null
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews & UGC</h2>
          <p className="text-muted-foreground mt-1">Moderate customer feedback and manage product ratings.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews, customers, products..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground mr-2" />
          <select
            className="h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 h-32 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-primary/40" />
          </div>
          <h3 className="text-lg font-semibold">No reviews found</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters to find what you are looking for."
              : "Customer reviews will appear here once they start sharing feedback."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className={`p-6 transition-all border-l-4 ${
              review.status === "pending" ? "border-l-yellow-400" :
              review.status === "approved" ? "border-l-green-400" :
              "border-l-transparent"
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    {review.user_full_name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{review.user_full_name}</span>
                      <span className="text-xs text-muted-foreground">{review.user_email}</span>
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(review.created_at), "PPP")}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-secondary rounded-full">
                        {review.product_name}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed italic mb-4">
                      "{review.comment}"
                    </p>

                    {review.admin_reply && (
                      <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 relative">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-white">Admin Response</Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {review.replied_at && format(new Date(review.replied_at), "PPP")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.admin_reply}
                        </p>
                      </div>
                    )}

                    {replyingTo === review.id && (
                      <div className="mt-4 space-y-3">
                        <Textarea
                          placeholder="Write your response to the customer..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-[100px] bg-white shadow-inner"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleReply(review.id)}>
                            Post Reply
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {review.status === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => updateStatus(review.id, "approved")}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => updateStatus(review.id, "rejected")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {!review.admin_reply && (
                        <DropdownMenuItem onClick={() => setReplyingTo(review.id)}>
                          <Reply className="h-4 w-4 mr-2" />
                          Reply to Review
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateStatus(review.id, "approved")}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Approved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(review.id, "rejected")}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Mark Rejected
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(review.id, "spam")} className="text-amber-600">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Mark as Spam
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10"
                        onClick={() => deleteReview(review.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
