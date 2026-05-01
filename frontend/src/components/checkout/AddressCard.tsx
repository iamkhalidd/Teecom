"use client"

import { useState, useEffect } from "react"
import { MapPin, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"

export default function AddressCard() {
  const [address, setAddress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAddress() {
      try {
        const data = await api.accounts.addresses.list()
        const addresses = Array.isArray(data) ? data : data.results || []
        // Use default address or first available
        const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0]
        setAddress(defaultAddr || null)
      } catch (err) {
        console.error("Failed to fetch addresses", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAddress()
  }, [])

  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-white border">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-3xl bg-white border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </h3>
        <Button variant="ghost" size="sm" className="text-primary font-bold">
          <Edit2 className="h-4 w-4 mr-2" />
          {address ? "Edit" : "Add"}
        </Button>
      </div>
      {address ? (
        <div className="flex flex-col gap-1">
          <p className="font-bold">{address.full_name}</p>
          <p className="text-sm text-muted-foreground">{address.phone}</p>
          <p className="text-sm text-muted-foreground">
            {address.address_line}, {address.city}, {address.state} {address.postal_code}, {address.country}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No shipping address saved. Please add one.</p>
      )}
    </div>
  )
}
