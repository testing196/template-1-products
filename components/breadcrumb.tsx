import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import type { Product } from "@/lib/types"

interface BreadcrumbProps {
  product: Product
}

export function Breadcrumb({ product }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
      <Link href="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link
        href={`/category/${product.category.toLowerCase().replace(" & ", "-").replace(" ", "-")}`}
        className="hover:text-primary transition-colors"
      >
        {product.category}
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">{product.name}</span>
    </nav>
  )
}
