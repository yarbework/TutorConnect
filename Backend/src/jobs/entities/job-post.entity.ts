import { 
  Entity, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  Index 
} from 'typeorm';
import { BaseAuditableEntity } from '../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';
import { 
  JobStatus, 
  TargetGradeLevel, 
  TeachingMode, 
  PreferredGender 
} from '../enums/job.enums';

@Entity('job_posts')
export class JobPost extends BaseAuditableEntity {
  @Index()
  @Column({ name: 'guardian_id', type: 'uuid' })
  guardian_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guardian_id' })
  guardian!: User;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'varchar', length: 100 })
  subject!: string;

  @Column({
    type: 'enum',
    enum: TargetGradeLevel,
  })
  grade_level!: TargetGradeLevel;

  @Column({ type: 'text' })
  learning_objectives!: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  max_hourly_budget!: number;

  @Column({ type: 'smallint' })
  weekly_hours_commitment!: number;

  @Column({
    type: 'enum',
    enum: TeachingMode,
  })
  teaching_mode!: TeachingMode;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city!: string | null;

  @Column({ type: 'text', nullable: true })
  physical_address!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  virtual_meeting_link!: string | null;

  @Column({
    type: 'enum',
    enum: PreferredGender,
    default: PreferredGender.ANY,
  })
  preferred_tutor_gender!: PreferredGender;

  @Index()
  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.DRAFT,
  })
  status!: JobStatus;
}