import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Engagement, EngagementStatus } from './entities/engagement.entity';
import { EngagementMessage } from './entities/engagement-message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { CloseEngagementDto } from './dto/close-engagement.dto';

@Injectable()
export class EngagementsService {
  constructor(
    @InjectRepository(Engagement)
    private readonly engagementRepo: Repository<Engagement>,
    @InjectRepository(EngagementMessage)
    private readonly messageRepo: Repository<EngagementMessage>,
  ) {}


  async createEngagement(
    jobId: string,
    guardianId: string,
    tutorId: string,
    agreedRate: number,
  ): Promise<Engagement> {
    const existing = await this.engagementRepo.findOne({
      where: { jobId, tutorId, status: EngagementStatus.ACTIVE },
    });

    if (existing) {
      return existing;
    }

    const engagement = this.engagementRepo.create({
      jobId,
      guardianId,
      tutorId,
      agreedHourlyRate: agreedRate,
      status: EngagementStatus.ACTIVE,
    });

    const saved = await this.engagementRepo.save(engagement);

    const welcomeMsg = this.messageRepo.create({
      engagementId: saved.id,
      senderId: guardianId,
      content:
        'Engagement initialized! Use this channel to coordinate schedule logistics, location landmarks, and preferred direct settlement options (e.g., Telebirr, CBE).',
    });
    await this.messageRepo.save(welcomeMsg);

    return saved;
  }


  async getUserEngagements(userId: string): Promise<Engagement[]> {
    return this.engagementRepo.find({
      where: [{ guardianId: userId }, { tutorId: userId }],
      relations: {
        job: true,
        guardian: true,
        tutor: true,
      },
      order: { updatedAt: 'DESC' },
    });
  }


  async getEngagementById(engagementId: string, userId: string): Promise<Engagement> {
    const engagement = await this.engagementRepo.findOne({
      where: { id: engagementId },
      relations: {
        job: true,
        guardian: true,
        tutor: true,
      },
    });

    if (!engagement) {
      throw new NotFoundException('Engagement contract not found');
    }

    if (engagement.guardianId !== userId && engagement.tutorId !== userId) {
      throw new ForbiddenException('You do not have permission to view this engagement');
    }

    return engagement;
  }

  /**
   * Fetches chronologically ordered message history
   */
  async getMessages(engagementId: string, userId: string): Promise<EngagementMessage[]> {
    await this.getEngagementById(engagementId, userId);

    return this.messageRepo.find({
      where: { engagementId },
      relations: { sender: true },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Dispatches a message inside the engagement chat
   */
  async sendMessage(
    engagementId: string,
    senderId: string,
    dto: SendMessageDto,
  ): Promise<EngagementMessage> {
    const engagement = await this.getEngagementById(engagementId, senderId);

    if (engagement.status !== EngagementStatus.ACTIVE) {
      throw new BadRequestException('Cannot send messages in a concluded engagement');
    }

    const message = this.messageRepo.create({
      engagementId,
      senderId,
      content: dto.content,
    });

    const saved = await this.messageRepo.save(message);

    // Update engagement timestamp to move it to the top of inbox lists
    await this.engagementRepo.update(engagementId, { updatedAt: new Date() });

    return saved;
  }

  /**
   * Concludes an engagement (Enables mutual reviews)
   */
  async closeEngagement(
    engagementId: string,
    userId: string,
    dto: CloseEngagementDto,
  ): Promise<Engagement> {
    const engagement = await this.getEngagementById(engagementId, userId);

    if (engagement.status !== EngagementStatus.ACTIVE) {
      throw new BadRequestException('Engagement is already closed');
    }

    engagement.status = dto.status;
    engagement.closedByUserId = userId;
    engagement.closedAt = new Date();

    return this.engagementRepo.save(engagement);
  }
}