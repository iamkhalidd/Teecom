import { CreditCard, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WalletCard() {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-primary p-8 text-primary-foreground">
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm opacity-80">Andrew Ainsley</span>
            <span className="font-mono tracking-widest text-lg">**** **** **** 3629</span>
          </div>
          <CreditCard className="h-8 w-8" />
        </div>
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Your balance</span>
            <span className="text-4xl font-bold">$9,379.00</span>
          </div>
          <Button variant="secondary" className="rounded-full gap-2 px-6">
            <PlusCircle className="h-5 w-5" />
            Top Up
          </Button>
        </div>
      </div>
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
    </div>
  )
}
