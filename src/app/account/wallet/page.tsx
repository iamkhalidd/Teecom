import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileNav from "@/components/layout/MobileNav"
import WalletCard from "@/components/wallet/WalletCard"
import TransactionList from "@/components/wallet/TransactionList"

export default function WalletPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">My E-Wallet</h1>
        <WalletCard />
        <TransactionList />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
