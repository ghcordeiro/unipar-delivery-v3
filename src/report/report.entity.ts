import { Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('report')
export class Report {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from', type: 'varchar', length: 120 })
  from: string;

  @Column({ name: 'to', type: 'varchar', length: 120 })
  to: string;

  @Column({ name: 'subject', type: 'varchar', length: 500 })
  subject: string;

  @Column({ name: 'body', type: 'varchar', length: 1000 })
  body: string;

  @Column({ name: 'status', type: 'boolean', default: false })
  status: boolean;

  @Column({ name: 'attemps', type: 'integer' })
  attemps: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
