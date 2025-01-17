'use client'

import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthToken } from '@/hooks/use-auth-token'
import { useToast } from '@/hooks/use-toast'
import { addToCart } from '@/lib/cart'

interface Product {
  id: number
  name: string
  description: string
  price: number
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function ProductsPage() {
  const { getAuthToken, isSignedIn } = useAuthToken()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  )

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data: ProductsResponse = await response.json()
        setProducts(data.products)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (productId: number) => {
    if (!isSignedIn) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoadingStates((prev) => ({ ...prev, [productId]: true }))
      const token = await getAuthToken()
      await addToCart(token, productId, 1)
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
      })
    } catch (error) {
      console.log('🚀 ~ handleAddToCart ~ error:', error)
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
              <p className="mt-4 text-lg font-semibold">${product.price}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                className="w-full"
                onClick={() => handleAddToCart(product.id)}
                disabled={loadingStates[product.id]}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {loadingStates[product.id] ? 'Adding...' : 'Add to Cart'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
