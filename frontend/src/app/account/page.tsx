"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import { Package, Heart, MapPin, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"

const menuItems = [
  { icon: Package, label: "My Orders", href: "/account/orders" },
  { icon: Heart, label: "My Wishlist", href: "/account/wishlist" },
  { icon: MapPin, label: "Shipping Address", href: "/account/address" },
  { icon: HelpCircle, label: "Customer Support", href: "/account/support" },
]

export default function AccountPage() {
  const { user, loading, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-2xl">
        {loading ? (
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-4 mb-8">
            <div className="h-20 w-20 rounded-full bg-secondary border-2 border-primary flex items-center justify-center text-2xl font-bold">
              {user.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.full_name}</h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 mb-8 py-8">
            <p className="text-muted-foreground">Please log in to view your account.</p>
            <Link href="/account/login" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold">
              Log In
            </Link>
          </div>
        )}

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
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary transition-colors text-destructive font-semibold text-left"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
