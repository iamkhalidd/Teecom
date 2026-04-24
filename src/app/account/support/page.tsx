import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import ChatWindow from "@/components/support/ChatWindow"
import SupportInput from "@/components/support/SupportInput"

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-32 md:pb-8 max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Customer Service</h1>
        <ChatWindow />
        <SupportInput />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
