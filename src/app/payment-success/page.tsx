import Link from "next/link"
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentSuccessPage() {
  const orderNumber = "ORD-7729-X21"
  const email = "sobakhul.munir527@gmail.com"

  return (
    <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="h-16 w-16" />
      </div>

      <h1 className="mb-2 text-3xl font-bold">Thanks for purchasing!</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Your order has been placed successfully. We'll send you an email confirmation
        to <span className="font-medium text-foreground">{email}</span> shortly.
      </p>

      <Card className="mb-10 w-full max-w-md border-none bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-4">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-semibold">{orderNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-semibold">E-Wallet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-lg">$385.00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full max-w-md flex-col gap-4">
        <Link href="/account/orders" className="w-full">
          <Button className="h-14 w-full rounded-full text-lg font-semibold">
            Track Order
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link href="/" className="w-full">
          <Button variant="outline" className="h-14 w-full rounded-full text-lg font-semibold">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
