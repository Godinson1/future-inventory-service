import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controllers/product.controller';
import { ProductsService } from './services/product.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './repository/product.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductController],
  providers: [ProductsService, ProductRepository],
})
export class ProductModule {}
