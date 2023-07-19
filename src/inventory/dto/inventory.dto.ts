import { Inventory } from '../entities/inventory.entity';
import { InventoryHistory } from '../entities/inventory_history.entity';

export class UpdateInventoryDto {
  productId: string;
  quantity: number;
}

export class InventoryInput {
  currentPrice: number;
  productName: string;
  productId: string;
  quantityPurchased: number;
  inventoryHistory?: InventoryHistory[];
  status: string;
  purchasedBy?: string;
  inventory?: Inventory;
}

export class OrderLineItems {
  productId: string;
  quantity: number;
  price: number;
}

export class OrderItemsInput {
  orderLineItems: OrderLineItems[];
  userId: string;
  orderId: string;
  Authentication: string;
}

export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}
