"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Trash2, Tag, Percent, Calendar, AlertCircle, Layout, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export default function CMSPage() {
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    expiry_date: "",
    image_url: "",
    is_active: true
  })

  const fetchOffers = useCallback(async () => {
    try {
      const data = await api.products.offers()
      setOffers(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      console.error("Failed to fetch offers", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  const handleDelete = async (id: number) => {
    if (confirm("Delete this special offer?")) {
      try {
        await api.products.offers.delete(id)
        fetchOffers()
      } catch (err) {
        console.error('Delete error:', err)
        alert("Failed to delete offer")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const dataToSubmit = {
        ...newOffer,
        discount_percentage: parseInt(newOffer.discount_percentage as string),
        expiry_date: new Date(newOffer.expiry_date).toISOString()
      }
      await api.products.offers.create(dataToSubmit)
      setIsDialogOpen(false)
      setNewOffer({ title: "", description: "", discount_percentage: "", expiry_date: "", image_url: "", is_active: true })
      fetchOffers()
    } catch (error) {
      console.error("Error creating offer", error)
      alert("Failed to create special offer")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Storefront Designer</h1>
          <p className="text-muted-foreground">Manage Hero Banners and Special Offers on your homepage.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2">
              <Plus className="h-4 w-4" /> New Offer Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Layout className="h-6 w-6" /> Create Home Banner
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Banner Title</label>
                <Input
                  required
                  placeholder="e.g. Summer Collection"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Description</label>
                <textarea
                  required
                  className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Banner subtitle/description..."
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Discount %</label>
                  <Input
                    required
                    type="number"
                    value={newOffer.discount_percentage}
                    onChange={(e) => setNewOffer({...newOffer, discount_percentage: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Expiry Date</label>
                  <Input
                    required
                    type="datetime-local"
                    value={newOffer.expiry_date}
                    onChange={(e) => setNewOffer({...newOffer, expiry_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Image URL</label>
                <div className="flex gap-2">
                    <Input
                        placeholder="https://..."
                        value={newOffer.image_url}
                        onChange={(e) => setNewOffer({...newOffer, image_url: e.target.value})}
                    />
                    <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Publish Banner"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Active Homepage Banners</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-3xl">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No active banners. Banners created here appear on the storefront.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 group">
                    <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                      {offer.image_url ? (
                        <img src={offer.image_url} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-sm">{offer.title}</h3>
                        <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">Active</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{offer.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                          <Percent className="h-3 w-3" /> {offer.discount_percentage}% OFF
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Ends {new Date(offer.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive h-8 w-8"
                        onClick={() => handleDelete(offer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-warning flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Live Preview Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Banners and Special Offers managed here are pushed directly to the customer storefront's "Special Offers" section.
            </p>
            <div className="p-4 rounded-2xl bg-muted/50 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Logic:</p>
              <ul className="text-xs space-y-1 list-disc pl-4 text-muted-foreground">
                <li>Banners are sorted by creation date (newest first).</li>
                <li>Only active and non-expired offers are visible to customers.</li>
                <li>Expired offers are automatically hidden from the storefront.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
