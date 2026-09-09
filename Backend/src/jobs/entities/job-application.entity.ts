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
import { JobPost } from './job-post.entity';
import { User } from '../../auth/entities/user.entity';

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',     
  SHORTLISTED = 'SHORTLISTED', 
  ACCEPTED = 'ACCEPTED',       
  REJECTED = 'REJECTED',       
}

@Entity('job_applications')
@Index(['job_id', 'tutor_id'], { unique: true }) 
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'job_id', type: 'uuid' })
  job_id!: string;

  @ManyToOne(() => JobPost, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job!: JobPost;

  @Index()
  @Column({ name: 'tutor_id', type: 'uuid' })
  tutor_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: User;

  @Column({ type: 'text' })
  pitch_message!: string; 

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  proposed_rate!: number; 

  @Column({ name: 'video_pitch_url', type: 'varchar', length: 500, nullable: true })
  video_pitch_url!: string | null; 

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.SUBMITTED,
  })
  status!: ApplicationStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}