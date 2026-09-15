import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Review, ReviewerRole } from './entities/review.entity';
import { Engagement, EngagementStatus } from '../engagements/entities/engagement.entity';
import { TutorProfile } from '../tutor/entities/tutor-profile.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Engagement)
    private readonly engagementRepo: Repository<Engagement>,
    @InjectRepository(TutorProfile)
    private readonly tutorProfileRepo: Repository<TutorProfile>,
    private readonly dataSource: DataSource,
  ) {}

  async createReview(reviewerId: string, dto: CreateReviewDto): Promise<Review> {
    const engagement = await this.engagementRepo.findOne({
      where: { id: dto.engagementId },
      relations: { job: true },
    });

    if (!engagement) {
      throw new NotFoundException('Engagement contract not found');
    }

    if (engagement.status !== EngagementStatus.COMPLETED) {
      throw new BadRequestException('Reviews can only be submitted for COMPLETED engagements');
    }

    const isGuardian = engagement.guardianId === reviewerId;
    const isTutor = engagement.tutorId === reviewerId;

    if (!isGuardian && !isTutor) {
      throw new ForbiddenException('You are not a participant in this engagement');
    }

    const reviewerRole = isGuardian ? ReviewerRole.GUARDIAN : ReviewerRole.TUTOR;
    const revieweeId = isGuardian ? engagement.tutorId : engagement.guardianId;

    const existing = await this.reviewRepo.findOne({
      where: { engagementId: dto.engagementId, reviewerId },
    });
    if (existing) {
      throw new ConflictException('You have already submitted a review for this engagement');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const review = queryRunner.manager.create(Review, {
        engagementId: dto.engagementId,
        reviewerId,
        revieweeId,
        reviewerRole,
        rating: dto.rating,
        tags: dto.tags || [],
        comment: dto.comment,
      });

      const savedReview = await queryRunner.manager.save(review);

      if (reviewerRole === ReviewerRole.GUARDIAN) {
        const stats = await queryRunner.manager
          .createQueryBuilder(Review, 'r')
          .select('AVG(r.rating)', 'avgRating')
          .addSelect('COUNT(r.id)', 'totalReviews')
          .where('r.reviewee_id = :tutorId', { tutorId: revieweeId })
          .getRawOne();

        const avgRating = parseFloat(stats.avgRating) || 0;
        const totalReviews = parseInt(stats.totalReviews, 10) || 0;

        await queryRunner.manager.update(
          TutorProfile,
          { userId: revieweeId },
          {
            averageRating: parseFloat(avgRating.toFixed(2)),
            totalReviews,
          },
        );
      }

      await queryRunner.commitTransaction();
      return savedReview;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getReviewsForTutor(tutorUserId: string): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { revieweeId: tutorUserId, reviewerRole: ReviewerRole.GUARDIAN },
      relations: {
        reviewer: true,
        engagement: { job: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getEngagementReviewStatus(engagementId: string, userId: string): Promise<{ hasReviewed: boolean }> {
    const existing = await this.reviewRepo.findOne({
      where: { engagementId, reviewerId: userId },
    });
    return { hasReviewed: Boolean(existing) };
  }
  async getEngagementReviews(
    engagementId: string,
    userId: string,
  ): Promise<{
    myReview: Review | null;
    counterpartyReview: Review | null;
  }> {
    const engagement = await this.engagementRepo.findOne({
      where: { id: engagementId },
    });

    if (!engagement) {
      throw new NotFoundException('Engagement contract not found');
    }

    if (engagement.guardianId !== userId && engagement.tutorId !== userId) {
      throw new ForbiddenException('You do not have access to this engagement’s reviews');
    }

    const reviews = await this.reviewRepo.find({
      where: { engagementId },
      relations: { reviewer: true },
      order: { createdAt: 'ASC' },
    });

    const myReview = reviews.find((r) => r.reviewerId === userId) || null;
    const counterpartyReview = reviews.find((r) => r.reviewerId !== userId) || null;

    return { myReview, counterpartyReview };
  }
  async getFeaturedReviews(limit = 3): Promise<Review[]> {
    return this.reviewRepo.find({
      where: {
        reviewerRole: ReviewerRole.GUARDIAN,
        rating: MoreThanOrEqual(4),
      },
      relations: {
        reviewer: true,
        engagement: { job: true },
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}