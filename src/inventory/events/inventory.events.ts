import { Injectable } from '@nestjs/common';
import { InventoryService } from '../service/inventory.service';
import { InventoryInput } from '../dto/inventory.dto';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class InventoryEvents {
  constructor(private readonly inventoryService: InventoryService) {}

  @OnEvent('product.created')
  handleProductCreatedEvent(payload: InventoryInput) {
    this.inventoryService.addInventory(payload);
  }

  @OnEvent('products.created')
  async handleProductsCreatedEvent(payload: InventoryInput[]) {
    for (const input of payload) {
      await this.inventoryService.addInventory(input);
    }
  }

  @OnEvent('inventory.top-up')
  handleInventoryTopUp(payload: InventoryInput) {
    this.inventoryService.addInventoryHistory(payload, payload.inventory);
  }
}
