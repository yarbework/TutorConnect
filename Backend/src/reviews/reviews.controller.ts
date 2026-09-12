import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async submitReview(@Req() req: any, @Body() dto: CreateReviewDto) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.reviewsService.createReview(userId, dto);
  }

  @Get('tutor/:tutorUserId')
  async getTutorReviews(@Param('tutorUserId', ParseUUIDPipe) tutorUserId: string) {
    return this.reviewsService.getReviewsForTutor(tutorUserId);
  }

  @Get('engagement/:engagementId/status')
  async checkEngagementReview(
    @Req() req: any,
    @Param('engagementId', ParseUUIDPipe) engagementId: string,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.reviewsService.getEngagementReviewStatus(engagementId, userId);
  }
}