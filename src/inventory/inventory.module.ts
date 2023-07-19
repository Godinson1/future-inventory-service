import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule, AuthModule } from 'future-connectors';
import { AUTH_SERVICE, ORDER_SERVICE } from 'src/constants';
import { InventoryController } from './controller/inventory.controller';
import { InventoryService } from './service/inventory.service';
import { InventoryRepository } from './repository/inventory.repository';
import { Inventory } from './entities/inventory.entity';

import { InventoryHistory } from './entities/inventory_history.entity';
import { InventoryEvents } from './events/inventory.events';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, InventoryHistory]),
    RmqModule,
    AuthModule,
    RmqModule.register({ name: AUTH_SERVICE }),
    RmqModule.register({ name: ORDER_SERVICE }),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository, InventoryEvents],
})
export class InventoryModule {}
