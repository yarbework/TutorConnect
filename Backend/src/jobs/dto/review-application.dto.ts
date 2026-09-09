import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApplicationStatus } from '../entities/job-application.entity';

export class ReviewApplicationDto {
  @IsNotEmpty()
  @IsEnum(ApplicationStatus, {
    message: 'Status must be either SHORTLISTED, ACCEPTED, or REJECTED',
  })
  status!: ApplicationStatus;
}