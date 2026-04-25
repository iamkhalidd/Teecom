import Link from "next/link"

const offers = [
  { title: "30%", subtitle: "Today's Special!", description: "Get discount for every order, only valid for today.", color: "bg-zinc-200" },
  { title: "25%", subtitle: "Weekends Sale", description: "Special weekend discount for all items.", color: "bg-zinc-100" },
  { title: "40%", subtitle: "New Arrivals", description: "Enjoy huge discount on our newest collection.", color: "bg-zinc-200" },
  { title: "20%", subtitle: "Black Friday", description: "Early access to our biggest sale of the year.", color: "bg-zinc-100" },
]

export default function SpecialOffers() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Special Offers</h2>
        <Link href="/products" className="text-sm font-semibold hover:underline">
          See All
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {offers.map((offer, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between overflow-hidden rounded-3xl p-8 ${offer.color}`}
          >
            <div className="max-w-[60%]">
              <h3 className="mb-2 text-4xl font-bold">{offer.title}</h3>
              <h4 className="mb-2 text-xl font-bold">{offer.subtitle}</h4>
              <p className="text-sm text-muted-foreground">{offer.description}</p>
            </div>
            <div className="h-24 w-24 rounded-2xl bg-white/40" />
          </div>
        ))}
      </div>
    </section>
  )
}
