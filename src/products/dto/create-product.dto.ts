export class CreateProductDto {
  name: string;
  category: string;
  manufacturer: string;
  productPhotoUrl: string;
  price: number;
  description: string;
  purchasedBy: string;
  initialQuantityPurchased: number;
}
