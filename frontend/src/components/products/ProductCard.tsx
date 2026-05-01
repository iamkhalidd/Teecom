"use client"

import { Heart, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

export default function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addItem(product.id, 1)
    } catch (err) {
      console.error("Failed to add to cart", err)
    }
  }

  return (
    <div className="group relative flex flex-col gap-3">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden rounded-3xl bg-[#EFEFEF]">
        {product.images?.[0] && (
          <img
            src={product.images[0].image_url || product.images[0].image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </Link>

      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-bold line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.rating_average > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs font-semibold">{product.rating_average}</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.discount_price && (
              <span className="text-lg font-bold">${product.discount_price}</span>
            )}
            <span className={product.discount_price ? "text-sm text-muted-foreground line-through" : "text-lg font-bold"}>
              ${product.price}
            </span>
          </div>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
