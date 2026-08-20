import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../enums/verification-status.enum';

export class VerifyCredentialsDto {
  @ApiProperty({
    example: 'APPROVED',
    enum: VerificationStatus,
    description: 'FR-PROF-03: Admin verification audit status decision (APPROVED or REJECTED)',
  })
  @IsNotEmpty()
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @ApiPropertyOptional({
    example: 'Verified degree diploma transcript against university registry.',
    description: 'Admin review note explaining verification rationale',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
