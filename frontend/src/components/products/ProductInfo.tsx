"use client"

import { useState } from "react"
import { Star, Minus, Plus, Heart, Truck, RefreshCcw, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/CartContext"

export default function ProductInfo({ product }: { product: any }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  // Derive sizes and colors from product variants
  const sizes = [...new Set(product.variants?.map((v: any) => v.size).filter(Boolean) || [])] as string[]
  const colors = [...new Set(product.variants?.map((v: any) => v.color).filter(Boolean) || [])] as string[]

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "")

  const currentPrice = product.discount_price || product.price
  const reviewCount = product.reviews?.length || 0

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await addItem(product.id, quantity, selectedSize || undefined, selectedColor || undefined)
    } catch (err) {
      console.error("Failed to add to cart", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="mt-2 flex items-center gap-4">
          {product.rating_average > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{product.rating_average}</span>
              {reviewCount > 0 && (
                <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
              )}
            </div>
          )}
          <span className={cn(
            "text-sm font-semibold px-2 py-1 rounded-lg",
            product.stock_quantity > 0 ? "bg-secondary" : "bg-destructive/10 text-destructive"
          )}>
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
          </span>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h3 className="font-bold mb-2">Description</h3>
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>

      {(sizes.length > 0 || colors.length > 0) && (
        <div className="flex gap-12">
          {sizes.length > 0 && (
            <div>
              <h3 className="font-bold mb-3">Size</h3>
              <div className="flex gap-2">
                {sizes.map((size: string) => (
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
          )}
          {colors.length > 0 && (
            <div>
              <h3 className="font-bold mb-3">Color</h3>
              <div className="flex gap-2">
                {colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-8 px-3 rounded-full border-2 text-xs font-semibold transition-all",
                      selectedColor === color ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-6">
        <h3 className="font-bold">Quantity</h3>
        <div className="flex items-center gap-4 rounded-full bg-secondary px-4 py-2">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-4 text-center font-bold">{quantity}</span>
          <button onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Total price</span>
          <span className="text-2xl font-bold">${(parseFloat(currentPrice) * quantity).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2">
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            className="h-12 rounded-full px-8 font-bold gap-2"
            onClick={handleAddToCart}
            disabled={loading || product.stock_quantity <= 0}
          >
            {loading ? "Adding..." : "Add to Cart"}
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
              Standard delivery available. Free shipping on orders over $500.
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
