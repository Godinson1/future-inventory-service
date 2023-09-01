import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InventoryRepository } from '../repository/inventory.repository';
import { Inventory } from '../entities/inventory.entity';
import { InventoryInput, InventoryStatus, OrderItemsInput, UpdateInventoryDto } from '../dto/inventory.dto';
import { DataSource, DeleteResult } from 'typeorm';
import { InventoryHistory } from '../entities/inventory_history.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository, private readonly dataSource: DataSource) {}

  getInventories(): Promise<Inventory[]> {
    return this.inventoryRepository.find();
  }

  async getInventory(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.getById(id);
    if (!inventory) throw new NotFoundException('Inventory not found!');
    return inventory;
  }

  async addInventory(input: InventoryInput): Promise<Inventory> {
    const newItem = await this.generateInventoryInput(input);
    return this.inventoryRepository.addInventory(newItem);
  }

  async addInventoryHistory(input: InventoryInput, inventory?: Inventory): Promise<InventoryHistory> {
    const inventoryHistory = new InventoryHistory();
    inventoryHistory.purchasedBy = input.purchasedBy;
    inventoryHistory.price = input.currentPrice;
    inventoryHistory.productId = String(input.productId);
    inventoryHistory.productName = input.productName;
    inventoryHistory.quantityPurchased = input.quantityPurchased;
    if (inventory) {
      inventoryHistory.inventory = inventory;
    }
    await this.dataSource.getRepository(InventoryHistory).save(inventoryHistory);
    return inventoryHistory;
  }

  async updateItem(input: UpdateInventoryDto): Promise<Inventory> {
    return this.dataSource.transaction(async (manager) => {
      const { productId, quantity } = input;
      const inventory = await manager.findOne(Inventory, {
        where: { productId },
      });
      if (!inventory) throw new NotFoundException('Inventory not found!');
      if (inventory.quantityRemaining < quantity) throw new BadRequestException('Insufficient product remaining!');
      inventory.quantitySold += quantity;
      inventory.quantityRemaining -= quantity;
      inventory.status = this.getInventoryStatus({
        quantityPurchased: inventory.quantityPurchased,
        quantityRemaining: inventory.quantityRemaining,
      });
      return manager.save(inventory);
    });
  }

  async addInventoryQuantity(id: string, quantity: number): Promise<Inventory> {
    return this.dataSource.transaction(async (manager) => {
      const inventory = await manager.findOne(Inventory, { where: { id } });
      if (!inventory) throw new NotFoundException('Inventory not found!');
      inventory.quantityPurchased += quantity;
      inventory.quantityRemaining = inventory.quantityPurchased - inventory.quantitySold;
      inventory.status = this.getInventoryStatus({
        quantityPurchased: inventory.quantityPurchased,
        quantityRemaining: inventory.quantityRemaining,
      });
      const updatedInventory = await manager.save(inventory);
      return updatedInventory;
    });
  }

  async verifyOrderDetails(input: OrderItemsInput): Promise<void> {
    const { orderLineItems } = input;
    for (const { quantity, productId } of orderLineItems) {
      const inventory = await this.inventoryRepository.getByProductId(productId);
      if (!inventory) return;
      if (inventory.quantityRemaining < quantity) return;
    }
  }

  deleteItem(id: string): Promise<DeleteResult> {
    return this.inventoryRepository.delete(id);
  }

  getInventoryStatus(input: { quantityRemaining: number; quantityPurchased: number }): string {
    const stockPercentage = (input.quantityRemaining / input.quantityPurchased) * 100;
    return stockPercentage <= 0 ? InventoryStatus.OUT_OF_STOCK : stockPercentage < 50 ? InventoryStatus.LOW_STOCK : InventoryStatus.IN_STOCK;
  }

  generateInventoryHistoryInput(input: Inventory, quantity: number) {
    return {
      ...input,
      inventory: input,
      purchasedBy: 'current-user',
      quantityPurchased: quantity,
    };
  }

  async generateInventoryInput(input: InventoryInput): Promise<InventoryInput> {
    const inventoryHistory = await this.addInventoryHistory(input);
    return {
      currentPrice: input.currentPrice,
      productName: input.productName,
      productId: String(input.productId),
      inventoryHistory: [inventoryHistory],
      quantityPurchased: input.quantityPurchased || 0,
      status: InventoryStatus.IN_STOCK,
    };
  }
}
