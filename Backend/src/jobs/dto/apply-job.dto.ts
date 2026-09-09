import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class ApplyJobDto {
  @IsNotEmpty({ message: 'Pitch message is required' })
  @IsString()
  @MinLength(20, { message: 'Your pitch must be at least 20 characters explaining your approach' })
  @MaxLength(3000, { message: 'Pitch cannot exceed 3000 characters' })
  pitch_message!: string;

  @IsNotEmpty({ message: 'Proposed hourly rate is required' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'Proposed rate must be greater than zero' })
  proposed_rate!: number;

  @IsOptional()
  @IsUrl({}, { message: 'Video pitch must be a valid URL (e.g., YouTube or Loom)' })
  video_pitch_url?: string;
}