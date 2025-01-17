import { User } from '@clerk/backend'
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ClerkAuthGuard, CurrentUser } from '@ozer-backend/auth'
import { CartService } from '@ozer-backend/ecom'

@Controller('cart')
@UseGuards(ClerkAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getMyCart(@CurrentUser() user: User) {
    return this.cartService.findUserCart(user.id)
  }

  @Post('items')
  async addToCart(@CurrentUser() user: User, @Body() data: { productId: number; quantity: number }) {
    return this.cartService.addItem(user.id, data.productId, data.quantity)
  }

  @Put('items/:itemId')
  async updateCartItem(@CurrentUser() user: User, @Param('itemId') itemId: number, @Body() data: { quantity: number }) {
    return this.cartService.updateItem(user.id, itemId, data.quantity)
  }

  @Delete('items/:itemId')
  async removeCartItem(@CurrentUser() user: User, @Param('itemId') itemId: number) {
    return this.cartService.removeItem(user.id, itemId)
  }
}
