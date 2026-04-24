import { Star, Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  price: number
  rating: number
  sales: number
  image: string
}

export default function ProductCard({ id, name, price, rating, sales, image }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col gap-3">
      <Link href={`/products/${id}`} className="relative aspect-square overflow-hidden rounded-3xl bg-secondary">
        <div className="h-full w-full bg-zinc-200 transition-transform group-hover:scale-105" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </Link>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-base font-bold leading-tight">{name}</h3>
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="font-semibold">{rating}</span>
          <span className="text-muted-foreground">| {sales} sold</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          <Button size="icon" className="h-8 w-8 rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
