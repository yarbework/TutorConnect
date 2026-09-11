import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Engagement } from './engagement.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('engagement_messages')
export class EngagementMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'engagement_id', type: 'uuid' })
  engagementId!: string;

  @ManyToOne(() => Engagement, (eng) => eng.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'engagement_id' })
  engagement!: Engagement;

  @Index()
  @Column({ name: 'sender_id', type: 'uuid' })
  senderId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender!: User;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @Index()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;
}