import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseAuditableEntity } from '../common/entities/base.entity';
import { User } from '../auth/entities/user.entity';

export enum VerificationStatus {
  PENDING_AUDIT = 'PENDING_AUDIT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum TeachingMode {
  ONLINE = 'ONLINE',
  IN_PERSON_TUTOR_HOME = 'IN_PERSON_TUTOR_HOME',
  IN_PERSON_STUDENT_HOME = 'IN_PERSON_STUDENT_HOME',
}

@Entity('tutor_profiles')
export class TutorProfile extends BaseAuditableEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 40.0 })
  hourly_rate!: number;

  @Column({ type: 'simple-array', default: 'ONLINE,IN_PERSON_TUTOR_HOME,IN_PERSON_STUDENT_HOME' })
  teaching_modes!: string[];

  @Column({ type: 'float', default: 15.0 })
  geographic_radius_km!: number;

  @Column({ type: 'text', nullable: true })
  availability_calendar!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  credential_pdf_url!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  credential_filename!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  uploaded_at!: Date | null;

  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING_AUDIT })
  verification_status!: VerificationStatus;

  @Column({ type: 'text', nullable: true })
  admin_review_note!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at!: Date | null;
}
