const API_URL = 'http://localhost:4000'

export async function addToCart(
  token: string | null,
  productId: number,
  quantity: number
) {
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(`${API_URL}/cart/items`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  })

  if (!response.ok) {
    throw new Error('Failed to add item to cart')
  }

  return response.json()
}

export async function updateCartItem(
  token: string | null,
  itemId: number,
  quantity: number
) {
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  })

  if (!response.ok) {
    throw new Error('Failed to update cart item')
  }

  return response.json()
}

export async function removeCartItem(token: string | null, itemId: number) {
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to remove cart item')
  }

  return response.json()
}
