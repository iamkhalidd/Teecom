"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2, Ticket, Percent, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_percentage: "",
    expiry_date: "",
    usage_limit: 100
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchCoupons = async () => {
    try {
      const data = await api.orders.coupons.list()
      setCoupons(data)
    } catch (err) {
      console.error("Failed to fetch coupons", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const deleteCoupon = async (code: string) => {
    if (confirm(`Delete coupon ${code}?`)) {
        try {
            await api.orders.coupons.deleteCoupon(code)
            setCoupons(coupons.filter(c => c.code !== code))
        } catch (err) {
            console.error("Failed to delete coupon", err)
        }
    }
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const dataToSubmit = {
        ...newCoupon,
        discount_percentage: parseInt(newCoupon.discount_percentage as string),
        expiry_date: new Date(newCoupon.expiry_date).toISOString()
      }
      const created = await api.orders.coupons.create(dataToSubmit)
      setCoupons([...coupons, created])
      setIsDialogOpen(false)
      setNewCoupon({ code: "", discount_percentage: "", expiry_date: "", usage_limit: 100 })
    } catch (error) {
      console.error("Error creating coupon", error)
      alert("Failed to create coupon")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Coupons</h1>
          <p className="text-muted-foreground mt-1">Manage discount codes and promotional offers.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2 px-6 h-12 text-sm font-bold transition-all hover:-translate-y-1">
              <Plus className="h-5 w-5" /> Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-primary/5 p-6 border-b border-border/50">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Ticket className="h-6 w-6 text-primary" />
                New Coupon
              </DialogTitle>
              <p className="text-muted-foreground text-sm mt-1">Fill in the details to create a new promotional code.</p>
            </div>
            <form onSubmit={handleCreateCoupon} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Coupon Code</label>
                  <Input 
                    required 
                    placeholder="e.g. SUMMER24" 
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    className="h-12 rounded-xl uppercase font-mono bg-secondary/50 focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Discount (%)</label>
                    <Input 
                      required 
                      type="number" 
                      min="1" 
                      max="100" 
                      placeholder="20"
                      value={newCoupon.discount_percentage}
                      onChange={(e) => setNewCoupon({...newCoupon, discount_percentage: e.target.value})}
                      className="h-12 rounded-xl bg-secondary/50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Usage Limit</label>
                    <Input 
                      required 
                      type="number" 
                      min="1" 
                      value={newCoupon.usage_limit}
                      onChange={(e) => setNewCoupon({...newCoupon, usage_limit: parseInt(e.target.value)})}
                      className="h-12 rounded-xl bg-secondary/50 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Expiry Date & Time</label>
                  <Input 
                    required 
                    type="datetime-local" 
                    value={newCoupon.expiry_date}
                    onChange={(e) => setNewCoupon({...newCoupon, expiry_date: e.target.value})}
                    className="h-12 rounded-xl bg-secondary/50 focus:bg-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 font-bold w-full sm:w-auto">
                  {isSubmitting ? "Creating..." : "Save Coupon"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-3xl" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-dashed border-border text-center">
          <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
            <Ticket className="h-10 w-10 text-primary/40" />
          </div>
          <h3 className="text-xl font-bold mb-2">No coupons yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">Create your first discount code to start running promotions and boosting sales.</p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="rounded-xl font-bold">
            Create First Coupon
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => {
            const isExpired = new Date(coupon.expiry_date) < new Date();
            const isActive = coupon.is_active && !isExpired;
            
            return (
              <div key={coupon.id} className="bg-white p-6 rounded-3xl shadow-sm border border-border/50 relative overflow-hidden group hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-inner">
                      <Percent className="h-7 w-7 text-primary" />
                    </div>
                    <Badge 
                      variant={isActive ? 'default' : 'secondary'} 
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${!isActive ? 'bg-muted text-muted-foreground' : ''}`}
                    >
                      {isActive ? 'Active' : isExpired ? 'Expired' : 'Inactive'}
                    </Badge>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-black font-mono tracking-wider text-foreground mb-1">{coupon.code}</h3>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      {coupon.discount_percentage}% OFF
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-dashed border-border/60">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase font-bold tracking-wider mb-1">Usage</span>
                      <span className="font-medium text-foreground">{coupon.used_count} <span className="text-muted-foreground/50">/</span> {coupon.usage_limit}</span>
                    </div>
                    <button 
                      onClick={() => deleteCoupon(coupon.code)} 
                      className="h-10 w-10 rounded-full bg-destructive/5 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-white transition-all duration-200"
                      title="Delete Coupon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
