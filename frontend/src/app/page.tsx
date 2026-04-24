import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import HeroBanner from "@/components/home/HeroBanner"
import CategoryGrid from "@/components/home/CategoryGrid"
import SpecialOffers from "@/components/home/SpecialOffers"
import PopularProducts from "@/components/home/PopularProducts"
import WhyShopWithUs from "@/components/home/WhyShopWithUs"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <HeroBanner />
        <CategoryGrid />
        <SpecialOffers />
        <PopularProducts />
        <WhyShopWithUs />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
