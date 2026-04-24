import { Truck, ChevronRight } from "lucide-react"

export default function ShippingMethod() {
  return (
    <div className="p-6 rounded-3xl bg-white border">
      <h3 className="font-bold mb-4">Choose Shipping</h3>
      <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold">Regular</p>
            <p className="text-xs text-muted-foreground">Estimated Dec 20-22</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">$15</span>
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
