import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { RmqService, JwtAuthGuard } from 'future-connectors';
import { InventoryService } from '../service/inventory.service';
import { InventoryInput, OrderItemsInput, UpdateInventoryDto } from '../dto/inventory.dto';
import { Inventory } from '../entities/inventory.entity';
import { EventPattern, Payload, Ctx, RmqContext, ClientProxy } from '@nestjs/microservices';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ORDER_SERVICE } from 'src/constants';
import { lastValueFrom } from 'rxjs';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rmqService: RmqService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(ORDER_SERVICE) private orderClient: ClientProxy,
  ) {}

  @Get()
  getInventories(): Promise<Inventory[]> {
    return this.inventoryService.getInventories();
  }

  @Get(':id')
  getInventory(@Param() params: any): Promise<Inventory> {
    return this.inventoryService.getInventory(params.id);
  }

  @Post()
  addInventory(@Body() input: InventoryInput): Promise<Inventory> {
    return this.inventoryService.addInventory(input);
  }

  @Put('/charge')
  updateInventory(@Body() input: UpdateInventoryDto): Promise<Inventory> {
    return this.inventoryService.updateItem(input);
  }

  @Patch('/add/:id')
  async addInventoryQuantity(@Param() params: any, @Body() input: { quantity: number }): Promise<Inventory> {
    const inventory = await this.inventoryService.addInventoryQuantity(params.id, input.quantity);
    this.eventEmitter.emit('inventory.top-up', this.inventoryService.generateInventoryHistoryInput(inventory, input.quantity));
    return inventory;
  }

  @Delete(':id')
  deleteItem(@Param() params: any): Promise<DeleteResult> {
    return this.inventoryService.deleteItem(params.id);
  }

  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  async verifyOrderDetails(@Payload() data: OrderItemsInput, @Ctx() context: RmqContext) {
    const { orderId, Authentication } = data;
    this.inventoryService.verifyOrderDetails(data);
    await lastValueFrom(this.orderClient.emit('order_verified', { status: true, orderId, Authentication }));
    this.rmqService.ack(context as any);
  }
}
