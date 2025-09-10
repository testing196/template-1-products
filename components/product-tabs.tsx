"use client"

import { useState } from "react"
import { Star, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Product } from "@/lib/types"

interface ProductTabsProps {
  product: Product
}

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    author: "Sarah Johnson",
    rating: 5,
    date: "2024-01-15",
    title: "Excellent quality!",
    content: "Really impressed with the build quality and performance. Exactly what I was looking for.",
    verified: true,
  },
  {
    id: "2",
    author: "Mike Chen",
    rating: 4,
    date: "2024-01-10",
    title: "Good value for money",
    content: "Works as expected. Good quality for the price point. Would recommend to others.",
    verified: true,
  },
  {
    id: "3",
    author: "Emily Davis",
    rating: 5,
    date: "2024-01-05",
    title: "Love it!",
    content: "Perfect for my needs. Fast shipping and great customer service.",
    verified: false,
  },
]

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <div className="mb-16">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>
                <p className="text-muted-foreground leading-relaxed">
                  This high-quality product is designed to meet your needs with exceptional performance and durability.
                  Crafted with attention to detail and using premium materials, it offers excellent value for money.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Premium quality materials and construction</li>
                  <li>Designed for long-lasting performance</li>
                  <li>Easy to use and maintain</li>
                  <li>Backed by manufacturer warranty</li>
                  <li>Excellent customer support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Category</span>
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">SKU</span>
                    <span className="text-muted-foreground">SKU-{product.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Weight</span>
                    <span className="text-muted-foreground">2.5 lbs</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Dimensions</span>
                    <span className="text-muted-foreground">12" x 8" x 4"</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Material</span>
                    <span className="text-muted-foreground">Premium Grade</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Warranty</span>
                    <span className="text-muted-foreground">2 Years</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Origin</span>
                    <span className="text-muted-foreground">Made in USA</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Certification</span>
                    <span className="text-muted-foreground">CE, FCC</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {/* Reviews Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{product.rating}</div>
                    <div className="flex items-center justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{product.reviewCount} reviews</div>
                  </div>

                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 mb-1">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${Math.random() * 80 + 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{review.author}</span>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>

                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-muted-foreground">{review.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
