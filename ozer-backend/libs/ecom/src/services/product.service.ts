import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@ozer-backend/database'

@Injectable()
export class ProductService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit
    const [products, total] = await Promise.all([
      this.db.product.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          createdAt: true,
        },
      }),
      this.db.product.count(),
    ])

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number) {
    const product = await this.db.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    })

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    return product
  }
}
