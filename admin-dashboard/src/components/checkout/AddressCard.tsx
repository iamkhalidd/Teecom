import { MapPin, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AddressCard() {
  return (
    <div className="p-6 rounded-3xl bg-white border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </h3>
        <Button variant="ghost" size="sm" className="text-primary font-bold">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-bold">Andrew Ainsley</p>
        <p className="text-sm text-muted-foreground">+234 812 345 6789</p>
        <p className="text-sm text-muted-foreground">61480 Sunbrook Park, PC 5679, Lagos, Nigeria</p>
      </div>
    </div>
  )
}
