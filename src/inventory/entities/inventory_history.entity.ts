import { IsEmpty, IsUUID, IsDate } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity({ name: 'inventory_histories' })
export class InventoryHistory {
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

  @Column({ name: 'price', nullable: true })
  price?: number;

  @Column({ name: 'quantity_purchased', nullable: true, type: 'text' })
  quantityPurchased?: number;

  @Column({ name: 'purchased_by', nullable: true, type: 'text' })
  purchasedBy?: string;

  @ManyToOne(() => Inventory, (inventory) => inventory.inventoryHistory, {
    onDelete: 'CASCADE',
  })
  inventory?: Inventory;

  @Column({ name: 'archived', nullable: true, type: 'text', default: false })
  archived?: string;
}
