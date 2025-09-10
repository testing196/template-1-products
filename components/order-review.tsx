"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import type { Address } from "@/lib/types"
import { Edit, CreditCard, Truck } from "lucide-react"

interface OrderReviewProps {
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  onBack: () => void
  onEdit: (step: number) => void
}

export function OrderReview({ shippingAddress, billingAddress, paymentMethod, onBack, onEdit }: OrderReviewProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()

  const subtotal = total
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const finalTotal = subtotal + shipping + tax

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Clear cart and redirect to success page
    clearCart()
    router.push("/order-success")
  }

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case "card":
        return "Credit/Debit Card"
      case "paypal":
        return "PayPal"
      case "bank":
        return "Bank Transfer"
      default:
        return paymentMethod
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">IMG</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Address
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <p className="font-medium">
              {shippingAddress.firstName} {shippingAddress.lastName}
            </p>
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </p>
            <p>{shippingAddress.country}</p>
            <p className="mt-2">
              <span className="text-muted-foreground">Email:</span> {shippingAddress.email}
            </p>
            <p>
              <span className="text-muted-foreground">Phone:</span> {shippingAddress.phone}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{getPaymentMethodDisplay()}</p>
          {billingAddress && (
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                Billing: {billingAddress.address}, {billingAddress.city}, {billingAddress.state}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Total */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          Back to Payment
        </Button>
        <Button onClick={handlePlaceOrder} disabled={isProcessing} className="flex-1" size="lg">
          {isProcessing ? "Processing..." : `Place Order - $${finalTotal.toFixed(2)}`}
        </Button>
      </div>
    </div>
  )
}
