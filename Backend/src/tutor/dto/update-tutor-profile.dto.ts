import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsOptional,
  Min,
  Max,
  Matches,
  IsObject,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import * as tutorProfileEntity from '../entities/tutor-profile.entity';
import { YOUTUBE_REGEX, DOCUMENT_URL_REGEX } from '../../common/utils/url-validators';

export class UpdateTutorProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(100, { message: 'Hourly rate must be at least 100 ETB' })
  @Max(1000, { message: 'Hourly rate cannot exceed 1000 ETB' })
  hourlyRate?: number;

  @IsOptional()
  @IsEnum(tutorProfileEntity.Gender)
  gender?: tutorProfileEntity.Gender;

  @IsOptional()
  @Matches(YOUTUBE_REGEX, {
    message: 'Must be a valid YouTube URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)',
  })
  youtubeVideoUrl?: string;

  @IsOptional()
  @Matches(DOCUMENT_URL_REGEX, {
    message: 'Document link must be a valid Google Drive or Canva share URL',
  })
  credentialsDocumentUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty({ message: 'Select at least one teaching subject' })
  subjects?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(tutorProfileEntity.DeliveryMode, { each: true })
  deliveryModes?: tutorProfileEntity.DeliveryMode[];

  @IsOptional()
  @IsString()
  cityOrSubcity?: string;

  @IsOptional()
  @IsObject()
  availability?: tutorProfileEntity.AvailabilityMatrix;
}