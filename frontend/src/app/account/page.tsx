import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import { User, Package, Wallet, Heart, MapPin, Shield, HelpCircle, LogOut } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { icon: User, label: "Edit Profile", href: "/account/profile" },
  { icon: Package, label: "My Orders", href: "/account/orders" },
  { icon: Wallet, label: "My Wallet", href: "/account/wallet" },
  { icon: Heart, label: "My Wishlist", href: "/account/wishlist" },
  { icon: MapPin, label: "Shipping Address", href: "/account/address" },
  { icon: Shield, label: "Security", href: "/account/security" },
  { icon: HelpCircle, label: "Customer Support", href: "/account/support" },
]

export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-20 w-20 rounded-full bg-secondary border-2 border-primary" />
          <div>
            <h1 className="text-2xl font-bold">Andrew Ainsley</h1>
            <p className="text-muted-foreground text-sm">andrew.ainsley@example.com</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-4 font-semibold">
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
              <Shield className="h-5 w-5 text-muted-foreground rotate-90" /> {/* Using Shield as a chevron-like icon or just omit it */}
            </Link>
          ))}
          <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary transition-colors text-destructive font-semibold text-left">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
