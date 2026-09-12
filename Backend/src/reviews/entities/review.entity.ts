import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Engagement } from '../../engagements/entities/engagement.entity';
import { User } from '../../auth/entities/user.entity';

export enum ReviewerRole {
  GUARDIAN = 'GUARDIAN',
  TUTOR = 'TUTOR',
}

@Entity('reviews')
@Index(['engagementId', 'reviewerId'], { unique: true }) 
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'engagement_id', type: 'uuid' })
  engagementId!: string;

  @ManyToOne(() => Engagement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'engagement_id' })
  engagement!: Engagement;

  @Index()
  @Column({ name: 'reviewer_id', type: 'uuid' })
  reviewerId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer!: User;

  @Index()
  @Column({ name: 'reviewee_id', type: 'uuid' })
  revieweeId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewee_id' })
  reviewee!: User;

  @Column({ type: 'enum', enum: ReviewerRole })
  reviewerRole!: ReviewerRole;

  @Column({ type: 'smallint' }) 
  rating!: number;

  @Column('text', { array: true, default: '{}' })
  tags!: string[]; 

  @Column({ type: 'text' })
  comment!: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;
}