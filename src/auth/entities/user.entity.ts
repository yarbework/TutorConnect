import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseAuditableEntity } from '../../common/entities/base.entity';

export enum UserRole {
  TUTOR = 'TUTOR',
  GUARDIAN = 'GUARDIAN',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User extends BaseAuditableEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUARDIAN })
  role!: UserRole;

  @Column({ type: 'boolean', default: false })
  is_email_verified!: boolean;

  // Storing the hash of the refresh token to invalidate sessions on demand
  @Column({ type: 'varchar', length: 255, nullable: true })
  refresh_token_hash!: string | null;
}