import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from '../schemas/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductRepository } from '../repository/product.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository, private eventEmitter: EventEmitter2) {}

  async addProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = await this.productRepository.addProduct(createProductDto);
      this.eventEmitter.emit('product.created', this.getProductCreatedInput(product));
      return product;
    } catch (error) {
      if (error.code === 11000) throw new BadRequestException('Product name already exists!');
    }
  }

  async addProducts(createProductDto: CreateProductDto[]) {
    const products = await this.productRepository.addProducts(createProductDto);
    this.eventEmitter.emit('products.created', products);
    return products;
  }

  getProduct(id: string) {
    return this.productRepository.findById(id);
  }

  getProducts() {
    return this.productRepository.findAll();
  }

  getProductsById(productIds: string[]) {
    return this.productRepository.findAllById(productIds);
  }

  async updateProduct(id: string, updatedProductDTO: CreateProductDto) {
    const product = await this.productRepository.findById(id);
    product.price = updatedProductDTO.price;
    return product.save();
  }

  deleteProduct(id: string) {
    return this.productRepository.deleteOne(id);
  }

  deleteProducts(productIds: string[]) {
    return this.productRepository.deleteAll(productIds);
  }

  getProductCreatedInput(input: Product) {
    return {
      currentPrice: input.price,
      productName: input.name,
      productId: input.id,
      quantityPurchased: input.initialQuantityPurchased,
      purchasedBy: input.purchasedBy,
    };
  }
}
