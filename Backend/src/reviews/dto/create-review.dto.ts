import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID()
  engagementId!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  rating!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsNotEmpty({ message: 'Feedback comment is required' })
  @IsString()
  @MinLength(10, { message: 'Comment must be at least 10 characters' })
  @MaxLength(1500, { message: 'Comment cannot exceed 1500 characters' })
  comment!: string;
}