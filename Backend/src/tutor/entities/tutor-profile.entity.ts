import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum DeliveryMode {
  ONLINE = 'ONLINE',
  IN_PERSON_TUTOR_HOME = 'IN_PERSON_TUTOR_HOME',
  IN_PERSON_STUDENT_HOME = 'IN_PERSON_STUDENT_HOME',
}

export interface DaySchedule {
  start: string; // "09:00"
  end: string;   //  "12:00"
}

export interface AvailabilityMatrix {
  monday?: DaySchedule[];
  tuesday?: DaySchedule[];
  wednesday?: DaySchedule[];
  thursday?: DaySchedule[];
  friday?: DaySchedule[];
  saturday?: DaySchedule[];
  sunday?: DaySchedule[];
}

@Entity('tutor_profiles')
@Index(['verificationStatus', 'hourlyRate']) 
export class TutorProfile {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  
  @OneToOne(() => User, (user) => user.tutorProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId!: string;

  @Column({ type: 'text', nullable: true })
    bio!: string;

  @Column({
        name: 'hourly_rate',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
    })
    hourlyRate!: number;

  @Column({ type: 'enum', enum: Gender, nullable: true })
    gender!: Gender;

  @Column({ name: 'youtube_video_url', type: 'varchar', length: 500, nullable: true })
    youtubeVideoUrl!: string;

  @Column({ name: 'youtube_video_id', type: 'varchar', length: 50, nullable: true })
    youtubeVideoId!: string;

  @Column({ name: 'credentials_document_url', type: 'varchar', length: 500, nullable: true })
    credentialsDocumentUrl!: string;

  @Column({
        name: 'verification_status',
        type: 'enum',
        enum: VerificationStatus,
        default: VerificationStatus.PENDING,
    })
    verificationStatus!: VerificationStatus;

  @Column({ type: 'text', array: true, default: '{}' })
    subjects!: string[];

  @Column({
        type: 'enum',
        enum: DeliveryMode,
        array: true,
        default: [DeliveryMode.ONLINE],
    })
    deliveryModes!: DeliveryMode[];

  @Column({ name: 'city_or_subcity', type: 'varchar', length: 100, nullable: true })
    cityOrSubcity!: string;

  @Column({ type: 'jsonb', default: {} })
    availability!: AvailabilityMatrix;

  @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}