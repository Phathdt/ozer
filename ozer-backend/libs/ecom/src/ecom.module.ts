import { Module } from '@nestjs/common'
import { DatabaseModule } from '@ozer-backend/database'

import { CartService, OrderService, ProductService } from './services'

@Module({
  imports: [DatabaseModule],
  providers: [ProductService, OrderService, CartService],
  exports: [ProductService, OrderService, CartService],
})
export class EcomModule {}
