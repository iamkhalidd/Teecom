import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductFilters() {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
      <Button variant="outline" className="rounded-full gap-2 border-2">
        <Filter className="h-4 w-4" />
        Filter
      </Button>
      {["All", "Popular", "Newest", "Price: Low to High", "Price: High to Low"].map((label) => (
        <Button key={label} variant="outline" className="rounded-full border-2">
          {label}
        </Button>
      ))}
    </div>
  )
}
