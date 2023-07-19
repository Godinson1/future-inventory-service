import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { ObjectIdColumn } from 'typeorm';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @ObjectIdColumn()
  id: ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  category: string;

  @Prop()
  manufacturer: string;

  @Prop()
  productPhotoUrl: string;

  @Prop()
  purchasedBy: string;

  @Prop()
  price: number;

  @Prop()
  currency: string;

  @Prop()
  status: string;

  @Prop()
  description: string;

  @Prop()
  sku_code: string;

  @Prop()
  initialQuantityPurchased: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
