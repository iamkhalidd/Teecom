"use client"

import { ArrowRight, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/CartContext"
import Link from "next/link"

export default function CartSummary() {
  const { subtotal, total } = useCart()

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <h3 className="font-bold">Promo Code</h3>
        <div className="relative">
          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Enter code" className="pl-10 rounded-xl border-none bg-secondary h-12" />
          <Button size="sm" className="absolute right-1 top-1 h-10 rounded-xl px-4">
            Apply
          </Button>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="h-px bg-border mt-2" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Link href="/checkout">
        <Button className="h-14 w-full rounded-full font-bold gap-2 text-base shadow-lg shadow-black/10">
          Checkout <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  )
}
