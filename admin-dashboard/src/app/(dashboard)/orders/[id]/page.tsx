"use client"

import { useState, useEffect, use } from "react"
import {
  ShoppingBag, Calendar, User, Mail, Phone, MapPin,
  Truck, CreditCard, ChevronLeft, Printer, Package,
  CheckCircle2, XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await api.orders.detail(resolvedParams.id)
        setOrder(data)
      } catch (err) {
        console.error("Failed to fetch order", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [resolvedParams.id])

  const handlePrintLabel = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const addr = order.shipping_address_detail || {}

    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label - #${order.order_number}</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 0.5in; font-family: sans-serif; }
            }
            .label-container {
              border: 2px solid #000;
              padding: 20px;
              width: 4in;
              margin: 0 auto;
            }
            .header {
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .section {
              margin-bottom: 15px;
            }
            .label {
              font-size: 10px;
              text-transform: uppercase;
              font-weight: bold;
              margin-bottom: 2px;
            }
            .value {
              font-size: 14px;
              font-weight: bold;
            }
            .items-list {
              font-size: 10px;
              border-top: 1px dashed #ccc;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="label-container">
            <div class="header">
              <div style="font-size: 20px; font-weight: bold;">LUMOCART</div>
              <div style="text-align: right;">
                <div style="font-size: 12px;">Order #${order.order_number}</div>
                <div style="font-size: 10px;">${new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div class="section">
              <div class="label">Ship To:</div>
              <div class="value">${addr.full_name || order.user_full_name}</div>
              <div class="value">${addr.address_line || ''}</div>
              <div class="value">${addr.city || ''}, ${addr.state || ''} ${addr.postal_code || ''}</div>
              <div class="value">${addr.country || ''}</div>
              <div class="value" style="margin-top: 5px;">${addr.phone || ''}</div>
            </div>

            <div class="section">
              <div class="label">Shipping Method:</div>
              <div class="value">${order.shipping_method_name || 'Standard Shipping'}</div>
            </div>

            <div class="items-list">
              <div class="label">Items:</div>
              ${order.items.map((item: any) => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span>${item.product_name} x ${item.quantity}</span>
                  <span>${item.size || ''} ${item.color || ''}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (loading) return <div className="p-8"><Skeleton className="h-96 w-full rounded-[2.5rem]" /></div>
  if (!order) return <div className="p-8">Order not found</div>

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/orders" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-semibold">
          <ChevronLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-none shadow-sm bg-white font-bold gap-2" onClick={handlePrintLabel}>
            <Printer className="h-4 w-4" /> Print Shipping Label
          </Button>
          <Button className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
            Fulfill Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-border/50 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Order #${order.order_number}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" /> ${new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge className="rounded-full px-4 py-1 text-sm font-bold uppercase">{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
               <div className="space-y-6">
                 {order.items.map((item: any) => (
                   <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 border-b last:border-0 border-border/50">
                     <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center">
                           <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                           <p className="font-bold">{item.product_name}</p>
                           <p className="text-xs text-muted-foreground">{item.size} / {item.color}</p>
                           <p className="text-xs font-bold mt-1">$${item.unit_price} x {item.quantity}</p>
                        </div>
                     </div>
                     <p className="font-bold">$${item.total_price}</p>
                   </div>
                 ))}
               </div>

               <div className="mt-12 pt-8 border-t border-border/50 space-y-3 max-w-xs ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-bold">$${order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Shipping</span>
                    <span className="font-bold">$${order.shipping_fee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Discount</span>
                    <span className="font-bold text-danger">-$${order.discount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl">$${order.total}</span>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-white rounded-[2rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="h-5 w-5" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
               <div>
                  <p className="font-bold text-sm">{order.user_full_name}</p>
                  <div className="space-y-2 mt-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" /> {order.user_email}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" /> {order.shipping_address_detail?.phone || 'No phone'}
                    </p>
                  </div>
               </div>

               <div className="pt-6 border-t border-border/50">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3 flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Shipping Address
                  </p>
                  <div className="text-sm space-y-1">
                     <p className="font-bold">{order.shipping_address_detail?.full_name}</p>
                     <p>{order.shipping_address_detail?.address_line}</p>
                     <p>{order.shipping_address_detail?.city}, {order.shipping_address_detail?.state} {order.shipping_address_detail?.postal_code}</p>
                     <p>{order.shipping_address_detail?.country}</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-[2rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
               <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">{order.payment_status}</span>
                  {order.payment_status === 'paid' ? <CheckCircle2 className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-warning" />}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
