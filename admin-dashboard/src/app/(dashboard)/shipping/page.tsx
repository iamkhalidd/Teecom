"use client"

import { useState, useEffect, useCallback } from "react"
import { Truck, Plus, Edit, Trash2, Globe, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"

export default function ShippingPage() {
  const [zones, setZones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showZoneDialog, setShowZoneDialog] = useState(false)
  const [showMethodDialog, setShowMethodDialog] = useState(false)
  const [currentZone, setCurrentZone] = useState<any>(null)
  const [currentMethod, setCurrentMethod] = useState<any>(null)
  const [zoneForm, setZoneForm] = useState<{name: string, countries: string[]}>({ name: "", countries: [] })
  const [methodForm, setMethodForm] = useState({
    name: "", description: "", price: 0,
    estimated_delivery: "", free_shipping_threshold: "",
    tracking_url_format: "", zone: null as any
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.admin.shipping.zones.list()
      setZones(data)
    } catch (err) {
      console.error("Failed to fetch shipping zones", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSaveZone = async () => {
    try {
      if (currentZone) {
        await api.admin.shipping.zones.update(currentZone.id, zoneForm)
      } else {
        await api.admin.shipping.zones.create(zoneForm)
      }
      setShowZoneDialog(false)
      fetchData()
    } catch (err) {
      alert("Failed to save zone")
    }
  }

  const handleSaveMethod = async () => {
    try {
      if (currentMethod) {
        await api.admin.shipping.adminMethods.update(currentMethod.id, methodForm)
      } else {
        await api.admin.shipping.adminMethods.create(methodForm)
      }
      setShowMethodDialog(false)
      fetchData()
    } catch (err) {
      alert("Failed to save shipping method")
    }
  }

  const handleDeleteZone = async (id: number) => {
    if (confirm("Delete this zone and all its methods?")) {
      try {
        await api.admin.shipping.zones.delete(id)
        fetchData()
      } catch (err) {
        alert("Failed to delete zone")
      }
    }
  }

  const handleDeleteMethod = async (id: number) => {
    if (confirm("Delete this shipping method?")) {
      try {
        await api.admin.shipping.adminMethods.delete(id)
        fetchData()
      } catch (err) {
        alert("Failed to delete method")
      }
    }
  }

  const openZoneDialog = (zone?: any) => {
    if (zone) {
      setCurrentZone(zone)
      setZoneForm({ name: zone.name, countries: zone.countries || [] })
    } else {
      setCurrentZone(null)
      setZoneForm({ name: "", countries: [] })
    }
    setShowZoneDialog(true)
  }

  const openMethodDialog = (zoneId: number, method?: any) => {
    if (method) {
      setCurrentMethod(method)
      setMethodForm({
        name: method.name,
        description: method.description || "",
        price: method.price,
        estimated_delivery: method.estimated_delivery || "",
        free_shipping_threshold: method.free_shipping_threshold || "",
        tracking_url_format: method.tracking_url_format || "",
        zone: zoneId
      })
    } else {
      setCurrentMethod(null)
      setMethodForm({
        name: "", description: "", price: 0,
        estimated_delivery: "", free_shipping_threshold: "",
        tracking_url_format: "", zone: zoneId
      })
    }
    setShowMethodDialog(true)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipping Configuration</h1>
          <p className="text-muted-foreground">Manage shipping zones, rates, and delivery rules.</p>
        </div>
        <Button onClick={() => openZoneDialog()} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/10">
          <Plus className="h-4 w-4" /> Add Shipping Zone
        </Button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
        ) : zones.length === 0 ? (
          <Card className="border-none shadow-sm p-12 text-center border-2 border-dashed border-border bg-white">
            <p className="text-muted-foreground">No shipping zones configured yet.</p>
            <Button onClick={() => openZoneDialog()} variant="outline" className="mt-4 rounded-xl">Create your first zone</Button>
          </Card>
        ) : (
          zones.map((zone) => (
            <Card key={zone.id} className="border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-muted/20 border-b border-border/50 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">{zone.name}</CardTitle>
                    <CardDescription className="text-xs font-medium uppercase tracking-wider">
                      {zone.countries.length === 0 ? 'All Countries' : `${zone.countries.length} Countries`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openZoneDialog(zone)}>
                      <Edit className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => handleDeleteZone(zone.id)}>
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {zone.methods?.map((method: any) => (
                    <div key={method.id} className="p-6 flex items-center justify-between hover:bg-muted/5 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                           <Truck className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description || 'Standard shipping method'}</p>
                          <div className="flex items-center gap-4 mt-2">
                             <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                               <Clock className="h-4 w-4" /> {method.estimated_delivery}
                             </div>
                             {method.free_shipping_threshold && (
                               <Badge variant="outline" className="text-[10px] bg-success/5 text-success border-success/20">
                                 Free over $${method.free_shipping_threshold}
                               </Badge>
                             )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Rate</p>
                            <p className="font-bold text-lg">$${method.price}</p>
                         </div>
                         <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => openMethodDialog(zone.id, method)}>
                               <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive" onClick={() => handleDeleteMethod(method.id)}>
                               <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-muted/5 flex justify-center">
                     <Button variant="ghost" className="text-primary font-bold text-xs gap-2" onClick={() => openMethodDialog(zone.id)}>
                        <Plus className="h-3.5 w-3.5" /> Add Shipping Method
                     </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Zone Dialog */}
      <Dialog open={showZoneDialog} onOpenChange={setShowZoneDialog}>
        <DialogContent className="rounded-[2rem] bg-white p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{currentZone ? 'Edit Zone' : 'New Shipping Zone'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Zone Name</label>
              <Input
                placeholder="e.g. Domestic, International"
                value={zoneForm.name}
                onChange={(e) => setZoneForm({...zoneForm, name: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Country Codes (Comma separated, empty for all)</label>
              <Input
                placeholder="US, CA, UK"
                value={zoneForm.countries.join(", ")}
                onChange={(e) => setZoneForm({...zoneForm, countries: e.target.value.split(",").map(c => c.trim()).filter(c => c)})}
                className="rounded-xl h-12"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowZoneDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveZone} className="px-8 rounded-xl font-bold">Save Zone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Method Dialog */}
      <Dialog open={showMethodDialog} onOpenChange={setShowMethodDialog}>
        <DialogContent className="rounded-[2rem] bg-white p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{currentMethod ? 'Edit Method' : 'New Shipping Method'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Method Name</label>
              <Input
                placeholder="Standard, Express"
                value={methodForm.name}
                onChange={(e) => setMethodForm({...methodForm, name: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Rate ($)</label>
              <Input
                type="number"
                value={methodForm.price}
                onChange={(e) => setMethodForm({...methodForm, price: parseFloat(e.target.value)})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold">Description</label>
              <Input
                placeholder="Briefly describe the shipping service"
                value={methodForm.description}
                onChange={(e) => setMethodForm({...methodForm, description: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Estimated Delivery</label>
              <Input
                placeholder="e.g. 3-5 business days"
                value={methodForm.estimated_delivery}
                onChange={(e) => setMethodForm({...methodForm, estimated_delivery: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Free Over ($) - Optional</label>
              <Input
                type="number"
                placeholder="e.g. 100"
                value={methodForm.free_shipping_threshold}
                onChange={(e) => setMethodForm({...methodForm, free_shipping_threshold: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold">Tracking URL Format</label>
              <Input
                placeholder="https://carrier.com/track/{tracking_number}"
                value={methodForm.tracking_url_format}
                onChange={(e) => setMethodForm({...methodForm, tracking_url_format: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowMethodDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveMethod} className="px-8 rounded-xl font-bold">Save Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
