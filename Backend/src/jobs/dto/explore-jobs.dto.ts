import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TargetGradeLevel, TeachingMode } from '../enums/job.enums';

export class ExploreJobsDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsEnum(TargetGradeLevel)
  grade_level?: TargetGradeLevel;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_budget?: number;

  @IsOptional()
  @IsEnum(TeachingMode)
  teaching_mode?: TeachingMode;

  @IsOptional()
  @IsString()
  city?: string;
}