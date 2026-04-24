import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import ProductGallery from "@/components/products/ProductGallery"
import ProductInfo from "@/components/products/ProductInfo"

export default function ProductDetailsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductGallery />
          <ProductInfo />
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
