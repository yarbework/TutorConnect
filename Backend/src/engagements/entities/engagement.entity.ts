import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { JobPost } from '../../jobs/entities/job-post.entity';
import { EngagementMessage } from './engagement-message.entity';

export enum EngagementStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  TERMINATED = 'TERMINATED',
}

@Entity('engagements')
export class Engagement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'job_id', type: 'uuid' })
  jobId!: string;

  @ManyToOne(() => JobPost, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job!: JobPost;

  @Index()
  @Column({ name: 'guardian_id', type: 'uuid' })
  guardianId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guardian_id' })
  guardian!: User;

  @Index()
  @Column({ name: 'tutor_id', type: 'uuid' })
  tutorId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: User;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  agreedHourlyRate!: number;

  @Column({
    type: 'enum',
    enum: EngagementStatus,
    default: EngagementStatus.ACTIVE,
  })
  status!: EngagementStatus;

  @Column({ name: 'closed_by_user_id', type: 'uuid', nullable: true })
  closedByUserId!: string | null;

  @Column({ name: 'closed_at', type: 'timestamp with time zone', nullable: true })
  closedAt!: Date | null;

  @OneToMany(() => EngagementMessage, (msg) => msg.engagement)
  messages!: EngagementMessage[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}