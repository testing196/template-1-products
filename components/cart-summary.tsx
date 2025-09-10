"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import Link from "next/link"
import { ShoppingCart, CreditCard } from "lucide-react"
import { PayPalCheckout } from "@/components/paypal-checkout"
import { useRouter } from "next/navigation"

export function CartSummary() {
  const { items, total, itemCount } = useCartStore()
  const router = useRouter()

  const subtotal = total
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const finalTotal = subtotal + shipping + tax

  const savings = items.reduce((acc, item) => {
    if (item.product.originalPrice) {
      return acc + (item.product.originalPrice - item.product.price) * item.quantity
    }
    return acc
  }, 0)

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Savings</span>
              <span>-${savings.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>

        {subtotal < 50 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
          </div>
        )}

        <div className="space-y-3">
          <Button size="lg" className="w-full" asChild>
            <Link href="/checkout">
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Link>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or pay with</span>
            </div>
          </div>
          
          <PayPalCheckout 
            onSuccess={(data) => {
              console.log("PayPal payment successful", data);
              router.push("/order-success");
            }}
            onError={(error) => {
              console.error("PayPal payment error", error);
            }}
          />

          <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>

        {/* Security Badge */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">🔒 Secure checkout with SSL encryption</p>
        </div>
      </CardContent>
    </Card>
  )
}
