import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsNumber, 
  IsPositive, 
  Min, 
  Max, 
  MaxLength, 
  IsOptional, 
  IsUrl, 
  ValidateIf 
} from 'class-validator';
import { 
  TargetGradeLevel, 
  TeachingMode, 
  PreferredGender,
  JobStatus 
} from '../enums/job.enums';

export class CreateJobPostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  subject!: string;

  @IsNotEmpty()
  @IsEnum(TargetGradeLevel)
  grade_level!: TargetGradeLevel;

  @IsNotEmpty()
  @IsString()
  learning_objectives!: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  max_hourly_budget!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(80)
  weekly_hours_commitment!: number;

  @IsNotEmpty()
  @IsEnum(TeachingMode)
  teaching_mode!: TeachingMode;

  // Conditional validations based on Teaching Mode
  @ValidateIf((o: CreateJobPostDto) => o.teaching_mode !== TeachingMode.ONLINE)
  @IsNotEmpty({ message: 'City is required for in-person tutoring' })
  @IsString()
  @MaxLength(255)
  city?: string;

  @ValidateIf((o: CreateJobPostDto) => o.teaching_mode !== TeachingMode.ONLINE)
  @IsNotEmpty({ message: 'Physical address is required for in-person tutoring' })
  @IsString()
  physical_address?: string;

  @ValidateIf((o: CreateJobPostDto) => o.teaching_mode === TeachingMode.ONLINE)
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format for virtual meeting link' })
  virtual_meeting_link?: string;

  @IsOptional()
  @IsEnum(PreferredGender)
  preferred_tutor_gender?: PreferredGender;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus; // Allows creating directly as DRAFT or PUBLISHED
}