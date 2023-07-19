import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schemas/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductRepository {
  constructor(@InjectModel(Product.name) private ProductModel: Model<Product>) {}

  findById(id: string) {
    return this.ProductModel.findById(id);
  }

  findAll(): Promise<Product[]> {
    return this.ProductModel.find();
  }

  findAllById(productIds: string[]) {
    return this.ProductModel.find({ _id: { $in: productIds } });
  }

  async addProduct(createProductDto: CreateProductDto): Promise<Product> {
    return new this.ProductModel(createProductDto).save();
  }

  addProducts(createProductDto: CreateProductDto[]) {
    return this.ProductModel.insertMany(createProductDto);
  }

  deleteOne(id: string) {
    return this.ProductModel.findByIdAndDelete(id);
  }

  deleteAll(productIds: string[]) {
    return this.ProductModel.deleteMany({ _id: { $in: productIds } });
  }
}
