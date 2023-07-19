import { IsEmpty, IsUUID, IsDate } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { InventoryHistory } from './inventory_history.entity';

@Entity({ name: 'inventories' })
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id: string;

  @IsDate()
  @CreateDateColumn({ name: 'created_date' })
  createdDate?: Date;

  @IsDate()
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate?: Date;

  @Column({ name: 'product_name', nullable: true, type: 'text' })
  productName?: string;

  @Column({ name: 'product_id', nullable: true, type: 'text' })
  productId?: string;

  @Column({ name: 'status', nullable: true, type: 'text' })
  status?: string;

  @Column({ name: 'current_price', nullable: true })
  currentPrice?: number;

  @Column({ name: 'quantity_purchased', nullable: true })
  quantityPurchased?: number;

  @Column({ name: 'quantity_sold', nullable: true, default: 0 })
  quantitySold?: number;

  @Column({ name: 'quantity_remaining', nullable: true, default: 0 })
  quantityRemaining?: number;

  @OneToMany(() => InventoryHistory, (inventoryHistory) => inventoryHistory.inventory, { cascade: true })
  inventoryHistory?: InventoryHistory[];

  @Column({ name: 'archived', nullable: true, type: 'text', default: false })
  archived?: string;
}
