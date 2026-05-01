import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white pt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              LUMOCART
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Modern, clean, and premium ecommerce store for your daily lifestyle needs.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Shop</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground">All Products</Link></li>
              <li><Link href="/products?category=clothes" className="hover:text-foreground">Clothes</Link></li>
              <li><Link href="/products?category=shoes" className="hover:text-foreground">Shoes</Link></li>
              <li><Link href="/products?category=electronics" className="hover:text-foreground">Electronics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Support</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/account/support" className="hover:text-foreground">Customer Support</Link></li>
              <li><Link href="/account/orders" className="hover:text-foreground">Track Orders</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Account</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/account" className="hover:text-foreground">My Account</Link></li>
              <li><Link href="/cart" className="hover:text-foreground">Shopping Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LumoCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
