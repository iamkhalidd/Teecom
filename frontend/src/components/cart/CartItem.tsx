"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function CartItem({ item }: { item: any }) {
  const { updateItem, removeItem } = useCart()

  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-[#EFEFEF]">
        {item.product_details?.images?.[0] && (
          <img
            src={item.product_details.images[0].image_url}
            alt={item.product_details.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between">
          <h3 className="font-bold">{item.product_details?.name}</h3>
          <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {item.size && `Size: ${item.size} | `}
          {item.color && `Color: ${item.color}`}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold">${item.price_snapshot}</span>
          <div className="flex items-center gap-4 rounded-full bg-[#EFEFEF] px-3 py-1">
            <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}>
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
            <button onClick={() => updateItem(item.id, item.quantity + 1)}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
