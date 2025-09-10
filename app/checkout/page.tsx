"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutSteps } from "@/components/checkout-steps"
import { ShippingForm } from "@/components/shipping-form"
import { PaymentForm } from "@/components/payment-form"
import { OrderReview } from "@/components/order-review"
import { CheckoutSummary } from "@/components/checkout-summary"
import { useCartStore } from "@/lib/cart-store"
import type { Address } from "@/lib/types"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function CheckoutPage() {
  const { items } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  const [billingAddress, setBillingAddress] = useState<Address | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [sameAsShipping, setSameAsShipping] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      redirect("/cart")
    }
  }, [items])

  if (items.length === 0) {
    return null
  }

  const steps = [
    { number: 1, title: "Shipping", description: "Delivery information" },
    { number: 2, title: "Payment", description: "Payment method" },
    { number: 3, title: "Review", description: "Review order" },
  ]

  const handleShippingSubmit = (address: Address) => {
    setShippingAddress(address)
    if (sameAsShipping) {
      setBillingAddress(address)
    }
    setCurrentStep(2)
  }

  const handlePaymentSubmit = (method: string, billing?: Address) => {
    setPaymentMethod(method)
    if (billing && !sameAsShipping) {
      setBillingAddress(billing)
    }
    setCurrentStep(3)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

            <CheckoutSteps steps={steps} currentStep={currentStep} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {currentStep === 1 && (
                  <ShippingForm
                    onSubmit={handleShippingSubmit}
                    sameAsShipping={sameAsShipping}
                    setSameAsShipping={setSameAsShipping}
                  />
                )}

                {currentStep === 2 && (
                  <PaymentForm
                    onSubmit={handlePaymentSubmit}
                    onBack={() => setCurrentStep(1)}
                    sameAsShipping={sameAsShipping}
                    shippingAddress={shippingAddress}
                  />
                )}

                {currentStep === 3 && (
                  <OrderReview
                    shippingAddress={shippingAddress!}
                    billingAddress={billingAddress!}
                    paymentMethod={paymentMethod}
                    onBack={() => setCurrentStep(2)}
                    onEdit={(step) => setCurrentStep(step)}
                  />
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <CheckoutSummary />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
