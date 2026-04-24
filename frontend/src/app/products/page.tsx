import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import ProductGrid from "@/components/products/ProductGrid"
import ProductFilters from "@/components/products/ProductFilters"

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8">
        <h1 className="mb-8 text-3xl font-bold">All Products</h1>
        <ProductFilters />
        <div className="mt-8">
          <ProductGrid />
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
