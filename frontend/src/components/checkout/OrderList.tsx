"use client"

import { useCart } from "@/context/CartContext"

export default function OrderList() {
  const { cart } = useCart()
  const items = cart?.items || []

  if (items.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white border">
        <h3 className="font-bold mb-4">Order List</h3>
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-3xl bg-white border">
      <h3 className="font-bold mb-4">Order List</h3>
      <div className="flex flex-col gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="flex gap-4">
            <div className="h-16 w-16 rounded-xl bg-secondary shrink-0 overflow-hidden">
              {item.product_details?.images?.[0] ? (
                <img
                  src={item.product_details.images[0].image_url || item.product_details.images[0].image}
                  alt={item.product_details?.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-zinc-200" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold">{item.product_details?.name || `Product #${item.product}`}</h4>
              <p className="text-xs text-muted-foreground">
                {item.color && `Color: ${item.color}`}
                {item.color && item.size && " | "}
                {item.size && `Size: ${item.size}`}
                {(item.color || item.size) && " | "}
                Qty: {item.quantity}
              </p>
              <span className="text-sm font-bold mt-1">
                ${(parseFloat(item.price_snapshot) * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
