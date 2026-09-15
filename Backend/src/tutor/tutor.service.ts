import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TutorProfile,
  VerificationStatus,
} from './entities/tutor-profile.entity';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { extractYoutubeVideoId } from '../common/utils/url-validators';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(TutorProfile)
    private readonly tutorProfileRepository: Repository<TutorProfile>,
  ) {}

  async getOrCreateProfile(userId: string): Promise<TutorProfile> {
    if (!userId) {
      throw new BadRequestException('User ID is missing or invalid in request');
    }
    let profile = await this.tutorProfileRepository.findOne({
      where: { userId },
      relations: {
        user: true,
      },
    });

    if (!profile) {
      profile = this.tutorProfileRepository.create({
        userId,
        verificationStatus: VerificationStatus.PENDING,
      });
      await this.tutorProfileRepository.save(profile);
    }

    return profile;
  }


  async updateProfile(
    userId: string,
    dto: UpdateTutorProfileDto,
  ): Promise<TutorProfile> {
    const profile = await this.getOrCreateProfile(userId);

    if (dto.youtubeVideoUrl) {
      const videoId = extractYoutubeVideoId(dto.youtubeVideoUrl);
      if (!videoId) {
        throw new BadRequestException('Could not parse YouTube video ID from provided URL');
      }
      profile.youtubeVideoUrl = dto.youtubeVideoUrl;
      profile.youtubeVideoId = videoId;
    }

    if (
      dto.credentialsDocumentUrl &&
      dto.credentialsDocumentUrl !== profile.credentialsDocumentUrl
    ) {
      profile.credentialsDocumentUrl = dto.credentialsDocumentUrl;
      profile.verificationStatus = VerificationStatus.PENDING;
    }

    if (dto.bio !== undefined) profile.bio = dto.bio;
    if (dto.hourlyRate !== undefined) profile.hourlyRate = dto.hourlyRate;
    if (dto.gender !== undefined) profile.gender = dto.gender;
    if (dto.subjects !== undefined) profile.subjects = dto.subjects;
    if (dto.deliveryModes !== undefined) profile.deliveryModes = dto.deliveryModes;
    if (dto.cityOrSubcity !== undefined) profile.cityOrSubcity = dto.cityOrSubcity;
    if (dto.availability !== undefined) profile.availability = dto.availability;

    return await this.tutorProfileRepository.save(profile);
  }


  async getPublicProfile(idOrUserId: string): Promise<Partial<TutorProfile>> {
    const profile = await this.tutorProfileRepository.findOne({
      where: [
        { id: idOrUserId },
        { userId: idOrUserId },
      ],
      relations: { user: true },
    });

    if (!profile) {
      throw new NotFoundException('Tutor profile not found');
    }

    const { credentialsDocumentUrl, ...publicData } = profile;
    return publicData;
  }

  
  async getFeaturedTutors(limit = 4): Promise<Partial<TutorProfile>[]> {
    const tutors = await this.tutorProfileRepository.find({
      where: { verificationStatus: VerificationStatus.APPROVED },
      relations: { user: true },
      order: { 
        averageRating: 'DESC',
        totalReviews: 'DESC', 
      },
      take: limit,
    });

    return tutors.map(({ credentialsDocumentUrl, ...publicData }) => publicData);
  }


  async searchTutors(filters: {
    subject?: string;
    city?: string;
    maxRate?: number;
    deliveryMode?: string;
    gender?: string;
  }): Promise<Partial<TutorProfile>[]> {
    const query = this.tutorProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('profile.verificationStatus = :status', {
        status: VerificationStatus.APPROVED,
      });

    if (filters.subject) {
      query.andWhere('array_to_string(profile.subjects, \',\') ILIKE :subject', {
        subject: `%${filters.subject}%`,
      });
    }

    if (filters.city) {
      query.andWhere('profile.cityOrSubcity ILIKE :city', {
        city: `%${filters.city}%`,
      });
    }

    if (filters.maxRate) {
      query.andWhere('profile.hourlyRate <= :maxRate', {
        maxRate: filters.maxRate,
      });
    }

    if (filters.deliveryMode) {
      query.andWhere(':deliveryMode = ANY(profile.deliveryModes)', {
        deliveryMode: filters.deliveryMode,
      });
    }

    if (filters.gender && filters.gender !== 'ANY') {
      query.andWhere('profile.gender = :gender', {
        gender: filters.gender,
      });
    }

    query.orderBy('profile.updatedAt', 'DESC');

    const tutors = await query.getMany();

    return tutors.map(({ credentialsDocumentUrl, ...publicData }) => publicData);
  }

  async getPublicPlatformStats() {
    const totalTutors = await this.tutorProfileRepository.count({
      where: { verificationStatus: VerificationStatus.APPROVED },
    });

    return {
      verifiedTutorsCount: totalTutors,
    };
  }
}