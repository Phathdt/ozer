import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ClerkAuthGuard, CurrentUser } from '@ozer-backend/auth'
import { OrderService } from '@ozer-backend/ecom'

@Controller('orders')
@UseGuards(ClerkAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getMyOrders(@CurrentUser('userId') userId: string) {
    return this.orderService.findUserOrders(userId)
  }

  @Get(':id')
  async getOrder(@CurrentUser('userId') userId: string, @Param('id') orderId: string) {
    return this.orderService.findOne(userId, orderId)
  }

  @Post()
  async createOrder(@CurrentUser('userId') userId: string) {
    return this.orderService.create(userId)
  }
}
