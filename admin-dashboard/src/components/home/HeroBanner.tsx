import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroBanner() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-[#E5E5E5] px-8 py-12 md:px-16 md:py-20">
        <div className="relative z-10 max-w-lg">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            New Arrival
          </h2>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Today's Special Offer
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Get up to 30% discount on every order, only valid for today.
          </p>
          <Link href="/products">
            <Button size="lg" className="rounded-full px-8 h-12">
              Shop Now
            </Button>
          </Link>
        </div>
        <div className="absolute right-0 top-0 hidden h-full w-1/2 items-center justify-center lg:flex">
          {/* In a real app, this would be an Image component */}
          <div className="h-64 w-64 rounded-2xl bg-white/50 backdrop-blur-sm" />
        </div>
      </div>
    </section>
  )
}
