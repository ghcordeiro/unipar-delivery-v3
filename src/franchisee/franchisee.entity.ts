import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToMany } from "typeorm";
import { Order } from "../order/order.entity";

@Entity("franchisee")
export class Franchisee {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: '80' })
  name: string;

  @Column({ name: 'cnpj', type: 'varchar', length: '14', unique: true })
  cnpj: string;

  @Column({ name: 'ie', type: 'varchar', length: '20' })
  ie: string;

  @Column({ name: 'address', type: 'varchar', length: '80' })
  address: string;

  @Column({ name: 'cep', type: 'integer' })
  cep: number;

  @Column({ name: 'neighborhood', type: 'varchar' })
  neighborhood: string;

  @Column({ name: 'password', type: 'varchar', length: 200 })
  password: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(type => Order, order => order.franchisee)
  order: Order;
}
