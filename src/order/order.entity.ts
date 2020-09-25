import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn, OneToMany } from "typeorm";
import { Franchisee } from '../franchisee/franchisee.entity';
import { OrderItem } from "../orderItem/orderItem.entity";

@Entity('order')
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', type: 'integer', generated: true, generatedType: 'STORED' })
  orderNumber: number;

  @Column({ name: 'order_date', type: 'date', default: 'now()' })
  orderDate: Date;

  @Column({ name: 'delivery_date', type: 'timestamp' })
  deliveryDate: Date;

  @Column({ name: 'shipping_company', type: 'varchar', length: 80 })
  shippingCompany: string;

  @Column({ name: 'shipping_address', type: 'varchar', length: 80 })
  shippingAddress: string;

  @Column({ name: 'total', type: 'numeric', precision: 15, scale: 2 })
  totalValue: number;

  @Column({ name: 'products_value', type: 'numeric', precision: 15, scale: 2 })
  productsValue: number;

  @Column({ name: 'discount_amount', type: 'numeric', precision: 15, scale: 2 })
  discountAmount: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(type => Franchisee, franchisee => franchisee.order, { cascade: true, eager: true, onDelete: 'SET NULL' })
  franchisee: Franchisee;

  @OneToMany(type => OrderItem, orderItem => orderItem.order, { cascade: true, eager: true, onDelete: 'CASCADE' })
  orderItems: OrderItem[];

}
