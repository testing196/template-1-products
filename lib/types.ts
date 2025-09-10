export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  tags?: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  shippingAddress: Address
  billingAddress: Address
}

export interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}
