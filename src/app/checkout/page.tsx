import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import AddressCard from "@/components/checkout/AddressCard"
import OrderList from "@/components/checkout/OrderList"
import ShippingMethod from "@/components/checkout/ShippingMethod"
import PaymentMethod from "@/components/checkout/PaymentMethod"
import PromoCode from "@/components/checkout/PromoCode"
import CheckoutSummary from "@/components/checkout/CheckoutSummary"

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <AddressCard />
            <OrderList />
            <ShippingMethod />
          </div>
          <div className="flex flex-col gap-6">
            <PromoCode />
            <PaymentMethod />
            <CheckoutSummary />
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
