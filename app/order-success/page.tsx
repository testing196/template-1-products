"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useCartStore } from "@/lib/cart-store"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()
  const router = useRouter()
  
  // Get PayPal order ID if it exists
  const paypalOrderId = searchParams.get("orderId") || ""
  
  // Generate a local order number if PayPal order ID is not available
  const orderNumber = paypalOrderId || `ORD-${Date.now().toString().slice(-6)}`
  
  useEffect(() => {
    // Clear the cart when the order is completed
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Number:</span>
                <span className="font-mono text-primary">{orderNumber}</span>
              </div>
              
              {paypalOrderId && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment Method:</span>
                  <span className="text-blue-600 font-medium">PayPal</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Delivery:</span>
                <span>3-5 business days</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <span className="text-green-600 font-medium">Processing</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Confirmation Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email with your order details and tracking information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Track Your Order</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive tracking information once your order ships.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button size="lg" asChild>
              <Link href="/">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
