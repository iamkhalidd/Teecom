"use client"

import { useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItemProps {
  id: string
  name: string
  price: number
  size: string
  color: string
  quantity: number
}

export default function CartItem({ id, name, price, size, color, quantity: initialQuantity }: CartItemProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  return (
    <div className="flex gap-4 p-4 rounded-3xl bg-white border">
      <div className="h-24 w-24 rounded-2xl bg-secondary overflow-hidden shrink-0">
        <div className="h-full w-full bg-zinc-200" />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">Color: {color} | Size: {size}</p>
          </div>
          <button className="text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          <div className="flex items-center gap-3 rounded-full bg-secondary px-3 py-1">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-4 text-center text-sm font-bold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
