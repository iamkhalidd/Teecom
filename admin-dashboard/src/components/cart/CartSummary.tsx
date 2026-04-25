import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CartSummary() {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-3xl bg-white border h-fit">
      <h2 className="text-xl font-bold">Order Summary</h2>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-bold text-foreground">$1,125.00</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span className="font-bold text-foreground">$15.00</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax</span>
          <span className="font-bold text-foreground">$0.00</span>
        </div>
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>$1,140.00</span>
        </div>
      </div>
      <Link href="/checkout">
        <Button className="w-full h-14 rounded-full text-lg font-bold">
          Checkout
        </Button>
      </Link>
    </div>
  )
}
