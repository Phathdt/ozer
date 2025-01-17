import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { auth } from '@clerk/nextjs/server'

interface CartItem {
  id: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
  }
}

interface Cart {
  id: number
  userId: string
  items: CartItem[]
}

async function getCart(): Promise<Cart> {
  const { getToken } = await auth()
  const token = await getToken()

  if (!token) {
    redirect('/sign-in')
  }

  const response = await fetch('http://localhost:4000/cart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch cart')
  }

  return response.json()
}

export default async function CartPage() {
  const cart = await getCart()
  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      {cart.items.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Your cart is empty
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex justify-between items-center py-4">
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${item.product.price * item.quantity}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${item.product.price} each
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="flex justify-between items-center py-4">
              <h3 className="text-lg font-semibold">Total</h3>
              <p className="text-lg font-semibold">${total}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Checkout</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
