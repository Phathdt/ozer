import { Controller, Get, Param, Query } from '@nestjs/common'
import { Public } from '@ozer-backend/auth'
import { ProductService } from '@ozer-backend/ecom'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  async getProducts(@Query() query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query
    return this.productService.findAll(page, limit)
  }

  @Public()
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productService.findOne(parseInt(id))
  }
}
