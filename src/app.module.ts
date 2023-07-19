import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InventoryModule } from './inventory/inventory.module';
import { ProductModule } from './products/product.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    InventoryModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
