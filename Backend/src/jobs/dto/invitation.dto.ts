import { IsNotEmpty, IsUUID, IsString, IsEnum } from 'class-validator';
import { InvitationStatus } from '../entities/job-invitation.entity';

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsUUID()
  job_id!: string;

  @IsNotEmpty()
  @IsUUID()
  tutor_id!: string; 

  @IsNotEmpty()
  @IsString()
  message!: string;
}

export class RespondInvitationDto {
  @IsNotEmpty()
  @IsEnum(InvitationStatus)
  status!: InvitationStatus.ACCEPTED | InvitationStatus.DECLINED;
}