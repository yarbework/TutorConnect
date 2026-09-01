import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from '../enums/job.enums';

export class UpdateJobStatusDto {
  @IsNotEmpty()
  @IsEnum(JobStatus)
  status!: JobStatus;
}