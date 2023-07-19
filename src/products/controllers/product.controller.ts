import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  addProduct(@Body() createCatDto: CreateProductDto) {
    return this.productService.addProduct(createCatDto);
  }

  @Post('/add-batch')
  addProducts(@Body() createCatDto: CreateProductDto[]) {
    return this.productService.addProducts(createCatDto);
  }

  @Get(':id')
  getProduct(@Param() params: any) {
    return this.productService.getProduct(params.id);
  }

  @Get()
  getProducts() {
    return this.productService.getProducts();
  }

  @Get('/batch/retrieve')
  getProductsById(@Body() productIds: string[]) {
    return this.productService.getProductsById(productIds);
  }

  @Put(':id')
  updateProduct(@Param() params: any, @Body() updatedProductDTO: CreateProductDto) {
    return this.productService.updateProduct(params.id, updatedProductDTO);
  }

  @Delete(':id')
  deleteProduct(@Param() params: any) {
    return this.productService.deleteProduct(params.id);
  }

  @Delete('/batch/delete')
  deleteProducts(@Body() productIds: string[]) {
    return this.productService.deleteProducts(productIds);
  }
}
