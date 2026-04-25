"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import CartItem from "@/components/cart/CartItem"
import CartSummary from "@/components/cart/CartSummary"
import { useCart } from "@/context/CartContext"
import { Skeleton } from "@/components/ui/skeleton"

export default function CartPage() {
  const { cart, loading } = useCart()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        {loading ? (
           <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                 <Skeleton className="h-32 w-full rounded-3xl" />
                 <Skeleton className="h-32 w-full rounded-3xl" />
              </div>
              <div className="lg:col-span-1">
                 <Skeleton className="h-64 w-full rounded-3xl" />
              </div>
           </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="text-center py-20">
             <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
             <p className="text-muted-foreground mb-8">Add some items to get started!</p>
             <button onClick={() => window.location.href='/products'} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold">
                Shop Now
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.items.map((item: any) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
