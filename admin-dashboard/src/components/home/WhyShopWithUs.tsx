import { Truck, ShieldCheck, RefreshCcw, Headset } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your orders delivered to your doorstep in no time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "We use the most secure payment gateways for your peace of mind.",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "Not satisfied? Return your product within 30 days, no questions asked.",
  },
  {
    icon: Headset,
    title: "Customer Support",
    description: "Our support team is available 24/7 to help you with any issues.",
  },
]

export default function WhyShopWithUs() {
  return (
    <section className="py-12 bg-white rounded-[2rem] my-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Shop With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted transition-colors">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
