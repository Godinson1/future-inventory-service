import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { InventoryInput } from '../dto/inventory.dto';

@Injectable()
export class InventoryRepository extends Repository<Inventory> {
  constructor(private dataSource: DataSource) {
    super(Inventory, dataSource.createEntityManager());
  }

  async getById(id: string) {
    return this.findOneBy({ id });
  }

  async getByProductId(productId: string) {
    return this.findOneBy({ productId });
  }

  async addInventory(itemDto: InventoryInput): Promise<Inventory> {
    const newItem = new Inventory();
    newItem.productName = itemDto.productName;
    newItem.productId = itemDto.productId;
    newItem.status = itemDto.status;
    newItem.currentPrice = itemDto.currentPrice;
    newItem.quantityPurchased = itemDto.quantityPurchased;
    newItem.inventoryHistory = itemDto.inventoryHistory;
    return this.save(newItem);
  }
}
