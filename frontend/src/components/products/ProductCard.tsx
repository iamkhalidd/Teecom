import { Heart, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="group relative flex flex-col gap-3">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden rounded-3xl bg-[#EFEFEF]">
        {product.images?.[0] && (
          <img
            src={product.images[0].image_url}
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
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-semibold">{product.rating_average || "4.5"}</span>
          </div>
          <span className="text-xs text-muted-foreground">| {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-lg font-bold">${product.price}</span>
          <Button size="icon" className="h-10 w-10 rounded-full">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
