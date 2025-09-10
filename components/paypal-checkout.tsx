"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"

// PayPal SDK imports
import { 
  PayPalScriptProvider, 
  PayPalButtons,
  FUNDING
} from '@paypal/react-paypal-js'

interface PayPalCheckoutProps {
  onSuccess?: (orderData: any) => void
  onError?: (error: any) => void
  onCancel?: () => void
}

export function PayPalCheckout({ 
  onSuccess, 
  onError,
  onCancel
}: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false)
  const { items, total } = useCartStore()

  // Create order via server API
  const createOrder = async () => {
    setLoading(true)
    try {
      // Format items for PayPal
      const formattedItems = items.map(item => ({
        product: {
          name: item.product.name,
          description: item.product.description,
          price: item.product.price
        },
        quantity: item.quantity
      }))

      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: formattedItems,
          total: total
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await response.json()
      return orderData.id
    } catch (error) {
      console.error('Error creating order:', error)
      if (onError) onError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Handle PayPal approval
  const handleApprove = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderID: data.orderID
        })
      })

      if (!response.ok) {
        throw new Error('Failed to capture order')
      }

      const orderData = await response.json()
      
      // Call success callback if provided
      if (onSuccess) onSuccess(orderData)
      
      return orderData
    } catch (error) {
      console.error('Error capturing order:', error)
      if (onError) onError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Configure PayPal Script options
  const paypalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
    components: 'buttons,funding-eligibility',
    // Enable additional funding sources
    'enable-funding': 'paylater,venmo,card',
  }

  return (
    <div className="w-full space-y-4">
      {loading && (
        <div className="flex justify-center py-2">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2 text-sm">Processing payment...</span>
        </div>
      )}
      
      <div id="paypal-button-container" className="w-full">
        <PayPalScriptProvider options={paypalScriptOptions}>
          {/* Standard PayPal Button */}
          <PayPalButtons
            disabled={loading || items.length === 0}
            forceReRender={[items, total]}
            style={{
              layout: 'vertical',
              shape: 'rect',
              color: 'blue'
            }}
            createOrder={createOrder}
            onApprove={handleApprove}
            onError={(error) => {
              console.error('PayPal error:', error)
              if(onError) onError(error)
            }}
            onCancel={() => {
              console.log('Payment cancelled')
              if(onCancel) onCancel()
            }}
          />
          
          {/* Venmo Button */}
          <PayPalButtons
            disabled={loading || items.length === 0}
            forceReRender={[items, total]}
            fundingSource={FUNDING.VENMO}
            style={{
              layout: 'vertical',
              shape: 'rect',
            }}
            createOrder={createOrder}
            onApprove={handleApprove}
            onError={(error) => {
              console.error('PayPal error:', error)
              if(onError) onError(error)
            }}
            onCancel={() => {
              console.log('Payment cancelled')
              if(onCancel) onCancel()
            }}
          />
          
          {/* Pay Later Button */}
          <PayPalButtons
            disabled={loading || items.length === 0}
            forceReRender={[items, total]}
            fundingSource={FUNDING.PAYLATER}
            style={{
              layout: 'vertical',
              shape: 'rect',
            }}
            createOrder={createOrder}
            onApprove={handleApprove}
            onError={(error) => {
              console.error('PayPal error:', error)
              if(onError) onError(error)
            }}
            onCancel={() => {
              console.log('Payment cancelled')
              if(onCancel) onCancel()
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  )
}