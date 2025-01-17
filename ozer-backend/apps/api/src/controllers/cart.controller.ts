import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ClerkAuthGuard, CurrentUser } from '@ozer-backend/auth'
import { CartService } from '@ozer-backend/ecom'

@Controller('cart')
@UseGuards(ClerkAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getMyCart(@CurrentUser('userId') userId: string) {
    return this.cartService.findUserCart(userId)
  }

  @Post('items')
  async addToCart(@CurrentUser('userId') userId: string, @Body() data: { productId: number; quantity: number }) {
    return this.cartService.addItem(userId, data.productId, data.quantity)
  }

  @Put('items/:itemId')
  async updateCartItem(
    @CurrentUser('userId') userId: string,
    @Param('itemId') itemId: number,
    @Body() data: { quantity: number }
  ) {
    return this.cartService.updateItem(userId, itemId, data.quantity)
  }

  @Delete('items/:itemId')
  async removeCartItem(@CurrentUser('userId') userId: string, @Param('itemId') itemId: number) {
    return this.cartService.removeItem(userId, itemId)
  }
}
