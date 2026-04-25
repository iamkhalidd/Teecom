import { Button } from "@/components/ui/button"

export default function CheckoutSummary() {
  return (
    <div className="p-6 rounded-3xl bg-white border flex flex-col gap-3">
      <div className="flex justify-between text-muted-foreground">
        <span>Amount</span>
        <span className="font-bold text-foreground">$1,125.00</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Shipping</span>
        <span className="font-bold text-foreground">$15.00</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Promo</span>
        <span className="font-bold text-destructive">-$337.50</span>
      </div>
      <div className="h-px bg-border my-2" />
      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>$802.50</span>
      </div>
      <Button className="w-full h-14 rounded-full text-lg font-bold mt-4">
        Confirm Payment
      </Button>
    </div>
  )
}
