"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Building } from "lucide-react"
import { PayPalCheckout } from "@/components/paypal-checkout"
import type { Address } from "@/lib/types"

interface PaymentFormProps {
  onSubmit: (method: string, billingAddress?: Address) => void
  onBack: () => void
  sameAsShipping: boolean
  shippingAddress: Address | null
}

export function PaymentForm({ onSubmit, onBack, sameAsShipping, shippingAddress }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [billingAddress, setBillingAddress] = useState<Address>(
    shippingAddress || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(paymentMethod, sameAsShipping ? undefined : billingAddress)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-5 w-5" />
                Credit/Debit Card
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                <div className="h-5 w-5 bg-[#0070ba] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PP</span>
                </div>
                PayPal
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                <Building className="h-5 w-5" />
                Bank Transfer
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "card" && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  value={cardData.name}
                  onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardData.number}
                  onChange={(e) => setCardData((prev) => ({ ...prev, number: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={cardData.expiry}
                    onChange={(e) => setCardData((prev) => ({ ...prev, expiry: e.target.value }))}
                    placeholder="MM/YY"
                  />
                </div>

                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={cardData.cvv}
                    onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === "paypal" && (
            <div className="space-y-4 p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                Click the PayPal button below to complete your purchase securely through PayPal.
              </p>
              <PayPalCheckout 
                onSuccess={(data) => {
                  // In a real implementation, you'd process the PayPal response
                  console.log("PayPal payment successful", data)
                  onSubmit("paypal", sameAsShipping ? undefined : billingAddress)
                }}
                onError={(error) => {
                  console.error("PayPal payment error", error)
                }}
                onCancel={() => {
                  console.log("PayPal payment cancelled")
                }}
              />
            </div>
          )}

          {!sameAsShipping && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingFirstName">First Name</Label>
                    <Input
                      id="billingFirstName"
                      value={billingAddress.firstName}
                      onChange={(e) => setBillingAddress((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingLastName">Last Name</Label>
                    <Input
                      id="billingLastName"
                      value={billingAddress.lastName}
                      onChange={(e) => setBillingAddress((prev) => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="billingAddress">Address</Label>
                  <Input
                    id="billingAddress"
                    value={billingAddress.address}
                    onChange={(e) => setBillingAddress((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="billingCity">City</Label>
                    <Input
                      id="billingCity"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingState">State</Label>
                    <Input
                      id="billingState"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress((prev) => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingZip">ZIP Code</Label>
                    <Input
                      id="billingZip"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Back to Shipping
            </Button>
            <Button type="submit" className="flex-1">
              Review Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
