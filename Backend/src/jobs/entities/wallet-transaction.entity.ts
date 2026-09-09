import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  CREDIT = 'CREDIT',   
  DEBIT = 'DEBIT',     
  REFUND = 'REFUND',   
}

export enum TransactionReason {
  REGISTRATION_BONUS = 'REGISTRATION_BONUS',
  JOB_APPLICATION = 'JOB_APPLICATION',
  CONNECTS_PURCHASE = 'CONNECTS_PURCHASE',
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT',
}

@Entity('wallet_transactions')
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'wallet_id', type: 'uuid' })
  walletId!: string;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_id' })
  wallet!: Wallet;

  @Column({ type: 'int' })
  amount!: number; 

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @Column({ type: 'enum', enum: TransactionReason })
  reason!: TransactionReason;

  @Column({ name: 'reference_id', type: 'varchar', length: 255, nullable: true })
  referenceId!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}