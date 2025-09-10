"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/lib/cart-store"
import type { CartItem as CartItemType } from "@/lib/types"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const { product, quantity } = item

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(product.id)
    } else {
      updateQuantity(product.id, newQuantity)
    }
  }

  const itemTotal = product.price * quantity

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Link href={`/product/${product.id}`}>
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
            </Link>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{product.description}</p>
            <div className="flex items-center mt-2">
              <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-col sm:items-end gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stockCount}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-lg">${itemTotal.toFixed(2)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(product.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stock Warning */}
        {quantity >= product.stockCount && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">Only {product.stockCount} items available in stock</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
