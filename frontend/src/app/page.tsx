import Header from "@/components/layout/Header"
import AnnouncementBar from "@/components/layout/AnnouncementBar"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import HeroBanner from "@/components/home/HeroBanner"
import DynamicHomeContent from "@/components/home/DynamicHomeContent"
import WhyShopWithUs from "@/components/home/WhyShopWithUs"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <HeroBanner />
        <DynamicHomeContent />
        <WhyShopWithUs />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
