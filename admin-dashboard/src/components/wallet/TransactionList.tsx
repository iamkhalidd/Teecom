const transactions = [
  { name: "Suga Leather Shoes", date: "Dec 15, 2024 | 10:00 AM", amount: -262.5, type: "Orders" },
  { name: "Top Up Wallet", date: "Dec 14, 2024 | 16:42 PM", amount: 500, type: "Top Up" },
  { name: "Werolla Cardigans", date: "Dec 14, 2024 | 11:39 AM", amount: -385, type: "Orders" },
  { name: "Mini Leather Bag", date: "Dec 13, 2024 | 14:46 PM", amount: -540, type: "Orders" },
  { name: "Top Up Wallet", date: "Dec 12, 2024 | 09:27 AM", amount: 550, type: "Top Up" },
]

export default function TransactionList() {
  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Transaction History</h3>
        <button className="text-sm font-bold text-primary">See All</button>
      </div>
      <div className="flex flex-col gap-4">
        {transactions.map((t, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-3xl bg-white border">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary" />
              <div className="flex flex-col">
                <h4 className="font-bold text-sm">{t.name}</h4>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-bold ${t.amount < 0 ? "text-foreground" : "text-success"}`}>
                {t.amount < 0 ? "" : "+"}${Math.abs(t.amount).toFixed(2)}
              </span>
              <p className="text-[10px] text-muted-foreground">{t.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
