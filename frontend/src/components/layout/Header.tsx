"use client"

import Link from "next/link"
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/CartContext"
import NotificationDropdown from "@/components/navigation/NotificationDropdown"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function Header() {
  const { cart } = useCart()
  const itemCount = cart?.items?.length || 0
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Track search query
      api.dashboard.trackSearch({ query: searchQuery, results_count: 0 }).catch(() => {})
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            LUMOCART
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Shop
            </Link>
            <Link href="/products?category=clothes" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Clothes
            </Link>
            <Link href="/products?category=shoes" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Shoes
            </Link>
            <Link href="/products?category=electronics" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Electronics
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 md:px-20">
          <form onSubmit={handleSearch} className="relative w-full max-w-[500px] hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 h-10 bg-secondary border-none rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <div className="hidden sm:flex">
            <NotificationDropdown />
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
