import { Shirt, Footprints, Briefcase, Smartphone, Watch, Gem, Utensils, Baby } from "lucide-react"
import Link from "next/link"

const categories = [
  { icon: Shirt, label: "Clothes", href: "/products?category=clothes" },
  { icon: Footprints, label: "Shoes", href: "/products?category=shoes" },
  { icon: Briefcase, label: "Bags", href: "/products?category=bags" },
  { icon: Smartphone, label: "Electronics", href: "/products?category=electronics" },
  { icon: Watch, label: "Watch", href: "/products?category=watch" },
  { icon: Gem, label: "Jewelry", href: "/products?category=jewelry" },
  { icon: Utensils, label: "Kitchen", href: "/products?category=kitchen" },
  { icon: Baby, label: "Toys", href: "/products?category=toys" },
]

export default function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Link href="/products" className="text-sm font-semibold hover:underline">
          See All
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
        {categories.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-transform group-hover:scale-110">
              <category.icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold">{category.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
