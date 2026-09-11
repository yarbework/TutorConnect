import { IsEnum, IsNotEmpty } from 'class-validator';
import { EngagementStatus } from '../entities/engagement.entity';

export class CloseEngagementDto {
  @IsNotEmpty()
  @IsEnum([EngagementStatus.COMPLETED, EngagementStatus.TERMINATED], {
    message: 'Status must be COMPLETED or TERMINATED',
  })
  status!: EngagementStatus.COMPLETED | EngagementStatus.TERMINATED;
}