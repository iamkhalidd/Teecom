import { CreditCard, Wallet, Landmark } from "lucide-react"

const methods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "wallet", name: "E-Wallet", icon: Wallet },
  { id: "bank", name: "Bank Transfer", icon: Landmark },
]

export default function PaymentMethod() {
  return (
    <div className="p-6 rounded-3xl bg-white border">
      <h3 className="font-bold mb-4">Payment Method</h3>
      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <div key={method.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary cursor-pointer border-2 border-transparent hover:border-primary transition-all">
            <div className="flex items-center gap-3">
              <method.icon className="h-5 w-5" />
              <span className="font-bold">{method.name}</span>
            </div>
            <div className="h-5 w-5 rounded-full border-2 border-primary" />
          </div>
        ))}
      </div>
    </div>
  )
}
