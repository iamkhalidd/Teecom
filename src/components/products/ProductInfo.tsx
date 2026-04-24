"use client"

import { useState } from "react"
import { Star, Minus, Plus, Heart, Truck, RefreshCcw, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ProductInfo() {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("40")
  const [selectedColor, setSelectedColor] = useState("brown")

  const sizes = ["38", "39", "40", "41", "42"]
  const colors = [
    { name: "brown", class: "bg-[#8B4513]" },
    { name: "black", class: "bg-black" },
    { name: "grey", class: "bg-grey-500" },
    { name: "white", class: "bg-white border" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Suga Leather Shoes</h1>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold">4.7</span>
            <span className="text-sm text-muted-foreground">(5,387 reviews)</span>
          </div>
          <span className="text-sm font-semibold px-2 py-1 bg-secondary rounded-lg">7,483 sold</span>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h3 className="font-bold mb-2">Description</h3>
        <p className="text-muted-foreground leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="flex gap-12">
        <div>
          <h3 className="font-bold mb-3">Size</h3>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-3">Color</h3>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all",
                  color.class,
                  selectedColor === color.name ? "ring-2 ring-primary ring-offset-2" : "border-transparent"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <h3 className="font-bold">Quantity</h3>
        <div className="flex items-center gap-4 rounded-full bg-secondary px-4 py-2">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-4 text-center font-bold">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Total price</span>
          <span className="text-2xl font-bold">$750.00</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2">
            <Heart className="h-5 w-5" />
          </Button>
          <Button className="h-12 rounded-full px-8 font-bold gap-2">
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Delivery Information</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated delivery: Dec 20 - Dec 22. Free shipping on orders over $500.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <RefreshCcw className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Return Policy</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Free 30-day returns. If the product doesn't fit, we'll pick it up for free.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Warranty</h4>
            <p className="text-xs text-muted-foreground mt-1">
              1-year international warranty against manufacturing defects.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
