"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"

export default function CheckoutSummary({ shippingFee = 0, discount = 0 }: { shippingFee?: number; discount?: number }) {
  const { subtotal } = useCart()
  const total = subtotal + shippingFee - discount

  return (
    <div className="p-6 rounded-3xl bg-white border flex flex-col gap-3">
      <div className="flex justify-between text-muted-foreground">
        <span>Amount</span>
        <span className="font-bold text-foreground">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Shipping</span>
        <span className="font-bold text-foreground">${shippingFee.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-muted-foreground">
          <span>Promo</span>
          <span className="font-bold text-destructive">-${discount.toFixed(2)}</span>
        </div>
      )}
      <div className="h-px bg-border my-2" />
      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <Button className="w-full h-14 rounded-full text-lg font-bold mt-4">
        Confirm Payment
      </Button>
    </div>
  )
}
