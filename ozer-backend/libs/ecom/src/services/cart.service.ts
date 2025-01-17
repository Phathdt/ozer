import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@ozer-backend/database'

@Injectable()
export class CartService {
  constructor(private readonly db: DatabaseService) {}

  async findUserCart(userId: string) {
    const cart = await this.db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    })

    if (!cart) {
      return this.db.cart.create({
        data: {
          userId,
          items: {},
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      })
    }

    return cart
  }

  async addItem(userId: string, productId: number, quantity: number) {
    const cart = await this.findUserCart(userId)

    console.log(222222)
    const existingItem = cart.items.find((item) => item.productId === productId)

    console.log(333333)
    if (existingItem) {
      console.log(44444)
      return this.updateItem(userId, existingItem.id, existingItem.quantity + quantity)
    }

    console.log(111111111)
    return this.db.cart.update({
      where: { userId },
      data: {
        items: {
          create: {
            productId,
            quantity,
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    })
  }

  async updateItem(userId: string, itemId: number, quantity: number) {
    const cart = await this.findUserCart(userId)
    const item = cart.items.find((item) => item.id === itemId)

    if (!item) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`)
    }

    if (quantity <= 0) {
      return this.removeItem(userId, itemId)
    }

    return this.db.cart.update({
      where: { userId },
      data: {
        items: {
          update: {
            where: { id: itemId },
            data: { quantity },
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    })
  }

  async removeItem(userId: string, itemId: number) {
    const cart = await this.findUserCart(userId)
    const item = cart.items.find((item) => item.id === itemId)

    if (!item) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`)
    }

    return this.db.cart.update({
      where: { userId },
      data: {
        items: {
          delete: {
            id: itemId,
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    })
  }
}
