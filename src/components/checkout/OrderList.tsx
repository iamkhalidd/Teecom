const items = [
  { name: "Werolla Cardigans", price: 385, size: "M", color: "Blue" },
  { name: "Suga Leather Shoes", price: 375, size: "40", color: "Brown" },
  { name: "Vinia Headphone", price: 360, size: "One Size", color: "Black" },
]

export default function OrderList() {
  return (
    <div className="p-6 rounded-3xl bg-white border">
      <h3 className="font-bold mb-4">Order List</h3>
      <div className="flex flex-col gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="h-16 w-16 rounded-xl bg-secondary shrink-0">
              <div className="h-full w-full bg-zinc-200" />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold">{item.name}</h4>
              <p className="text-xs text-muted-foreground">Color: {item.color} | Size: {item.size}</p>
              <span className="text-sm font-bold mt-1">${item.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
