import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TeachingMode } from '../../common/enums/teaching-mode.enum';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 45.0, description: 'Hourly tutoring rate in USD ($/hr)' })
  @IsOptional()
  @IsNumber()
  @Min(5)
  hourlyRate?: number;

  @ApiPropertyOptional({
    example: ['ONLINE', 'IN_PERSON_TUTOR_HOME', 'IN_PERSON_STUDENT_HOME'],
    enum: TeachingMode,
    isArray: true,
    description: 'FR-PROF-04: Preferred teaching delivery modes',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TeachingMode, { each: true })
  teachingModes?: TeachingMode[];

  @ApiPropertyOptional({ example: 15.0, description: 'FR-PROF-04: Maximum geographic tutoring radius in kilometers' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  geographicRadiusKm?: number;

  @ApiPropertyOptional({
    example: '{"monday":[{"start":"09:00","end":"12:00"}],"tuesday":[{"start":"14:00","end":"18:00"}]}',
    description: 'FR-PROF-04: Interactive weekly availability calendar JSON matrix',
  })
  @IsOptional()
  @IsString()
  availabilityCalendar?: string;

  @ApiPropertyOptional({ example: 'Ph.D. in Physics with over 10 years of academic experience.' })
  @IsOptional()
  @IsString()
  bio?: string;
}
