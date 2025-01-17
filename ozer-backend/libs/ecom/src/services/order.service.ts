import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@ozer-backend/database';

@Injectable()
export class OrderService {
  constructor(private readonly db: DatabaseService) {}

  async findUserOrders(userId: string) {
    return this.db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.db.order.findFirst({
      where: {
        id: Number(orderId),
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  async create(userId: string) {
    const cart = await this.db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Calculate total price
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const order = await this.db.order.create({
      data: {
        userId,
        total,
        status: 'pending',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
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
                image: true,
              },
            },
          },
        },
      },
    });

    // Clear cart after order creation
    await this.db.cart.update({
      where: { userId },
      data: {
        items: {
          deleteMany: {},
        },
      },
    });

    return order;
  }
}
