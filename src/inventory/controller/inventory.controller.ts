import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { RmqService, JwtAuthGuard } from 'future-connectors';
import { InventoryService } from '../service/inventory.service';
import { InventoryInput, OrderItemsInput, UpdateInventoryDto } from '../dto/inventory.dto';
import { Inventory } from '../entities/inventory.entity';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService, private readonly rmqService: RmqService) {}

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
  addInventoryQuantity(@Param() params: any, @Body() input: { quantity: number }): Promise<Inventory> {
    return this.inventoryService.addInventoryQuantity(params.id, input.quantity);
  }

  @Delete(':id')
  deleteItem(@Param() params: any): Promise<DeleteResult> {
    return this.inventoryService.deleteItem(params.id);
  }

  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  verifyOrderDetails(@Payload() data: OrderItemsInput, @Ctx() context: RmqContext) {
    console.log('check', data);
    this.inventoryService.verifyOrderDetails(data);
    this.rmqService.ack(context as any);
  }
}
