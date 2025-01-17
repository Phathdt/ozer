import { User } from '@clerk/backend'
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ClerkAuthGuard, CurrentUser } from '@ozer-backend/auth'
import { OrderService } from '@ozer-backend/ecom'

@Controller('orders')
@UseGuards(ClerkAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getMyOrders(@CurrentUser() user: User) {
    return this.orderService.findUserOrders(user.id)
  }

  @Get(':id')
  async getOrder(@CurrentUser() user: User, @Param('id') orderId: string) {
    return this.orderService.findOne(user.id, orderId)
  }

  @Post()
  async createOrder(@CurrentUser() user: User) {
    return this.orderService.create(user.id)
  }
}
