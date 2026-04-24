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
              <li><Link href="/products?category=accessories" className="hover:text-foreground">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Support</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/account/support" className="hover:text-foreground">Customer Support</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-foreground">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
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
