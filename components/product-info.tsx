"use client"

import { useState } from "react"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import type { Product } from "@/lib/types"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Product Title and Rating */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{product.category}</Badge>
          {product.originalPrice && (
            <Badge className="bg-destructive text-destructive-foreground">{discount}% OFF</Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        {product.originalPrice && (
          <p className="text-sm text-green-600">You save ${(product.originalPrice - product.price).toFixed(2)}</p>
        )}
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
        <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
          {product.inStock ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
        </span>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label htmlFor="quantity" className="font-medium">
            Quantity:
          </label>
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-4 py-2 font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
              disabled={quantity >= product.stockCount}
            >
              +
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          <Button variant="outline" size="lg">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="h-5 w-5 text-primary" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="h-5 w-5 text-primary" />
          <span>2-year warranty included</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RefreshCw className="h-5 w-5 text-primary" />
          <span>30-day return policy</span>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
