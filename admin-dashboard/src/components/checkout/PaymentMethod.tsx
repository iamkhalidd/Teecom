"use client"

import { useState } from "react"
import { CreditCard, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"

const methods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "bank", name: "Bank Transfer", icon: Landmark },
]

export default function PaymentMethod({ selected, onSelect }: { selected?: string; onSelect?: (id: string) => void }) {
  const [selectedMethod, setSelectedMethod] = useState(selected || "card")

  const handleSelect = (id: string) => {
    setSelectedMethod(id)
    onSelect?.(id)
  }

  return (
    <div className="p-6 rounded-3xl bg-white border">
      <h3 className="font-bold mb-4">Payment Method</h3>
      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => handleSelect(method.id)}
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl bg-secondary cursor-pointer border-2 transition-all",
              selectedMethod === method.id ? "border-primary" : "border-transparent hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-3">
              <method.icon className="h-5 w-5" />
              <span className="font-bold">{method.name}</span>
            </div>
            <div className={cn(
              "h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center",
            )}>
              {selectedMethod === method.id && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
