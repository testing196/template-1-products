import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductTabs } from "@/components/product-tabs"
import { RelatedProducts } from "@/components/related-products"
import { Breadcrumb } from "@/components/breadcrumb"
import { products } from "@/lib/mock-data"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb product={product} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>

          <ProductTabs product={product} />

          {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}
