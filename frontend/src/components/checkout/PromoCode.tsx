import { Tag, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PromoCode() {
  return (
    <div className="p-6 rounded-3xl bg-white border">
      <h3 className="font-bold mb-4">Promo Code</h3>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Enter promo code" className="pl-10 h-12 bg-secondary border-none rounded-2xl" />
        </div>
        <Button className="h-12 w-12 rounded-2xl shrink-0">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
