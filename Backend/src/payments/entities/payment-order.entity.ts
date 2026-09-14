import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum PaymentOrderStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentProvider {
  MOCK = 'MOCK',
  CHAPA = 'CHAPA',
  TELEBIRR = 'TELEBIRR',
}

@Entity('payment_orders')
export class PaymentOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ name: 'tx_ref', type: 'varchar', length: 100 })
  txRef!: string; 

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amountETB!: number;

  @Column({ type: 'int' })
  connectsAmount!: number;

  @Column({
    type: 'enum',
    enum: PaymentOrderStatus,
    default: PaymentOrderStatus.PENDING,
  })
  status!: PaymentOrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
    default: PaymentProvider.MOCK,
  })
  provider!: PaymentProvider;

  @Column({ name: 'gateway_reference', type: 'varchar', length: 255, nullable: true })
  gatewayReference!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  rawGatewayResponse!: Record<string, any> | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}