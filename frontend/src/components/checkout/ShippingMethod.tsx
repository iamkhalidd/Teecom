"use client"

import { useState, useEffect } from "react"
import { Truck, ChevronRight } from "lucide-react"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function ShippingMethod({ onSelect }: { onSelect?: (method: any) => void }) {
  const [methods, setMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    async function fetchMethods() {
      try {
        const data = await api.shipping.methods()
        const list = Array.isArray(data) ? data : data.results || []
        setMethods(list)
        if (list.length > 0) {
          setSelected(list[0].id)
          onSelect?.(list[0])
        }
      } catch (err) {
        console.error("Failed to fetch shipping methods", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMethods()
  }, [])

  const handleSelect = (method: any) => {
    setSelected(method.id)
    onSelect?.(method)
  }

  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-white border">
        <h3 className="font-bold mb-4">Choose Shipping</h3>
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="p-6 rounded-3xl bg-white border">
      <h3 className="font-bold mb-4">Choose Shipping</h3>
      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => handleSelect(method)}
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2",
              selected === method.id ? "bg-secondary border-primary" : "bg-secondary border-transparent hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Truck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">{method.name}</p>
                <p className="text-xs text-muted-foreground">{method.estimated_delivery}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">${parseFloat(method.price).toFixed(2)}</span>
            </div>
          </button>
        ))}
        {methods.length === 0 && (
          <p className="text-sm text-muted-foreground">No shipping methods available.</p>
        )}
      </div>
    </div>
  )
}
