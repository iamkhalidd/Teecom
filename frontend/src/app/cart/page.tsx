import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import CartItem from "@/components/cart/CartItem"
import CartSummary from "@/components/cart/CartSummary"

const cartItems = [
  { id: "1", name: "Snake Leather Bag", price: 445, size: "M", color: "Black", quantity: 1 },
  { id: "2", name: "Suga Leather Shoes", price: 375, size: "40", color: "Brown", quantity: 1 },
  { id: "3", name: "Leather Casual Suit", price: 420, size: "L", color: "Grey", quantity: 1 },
]

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} {...item} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
