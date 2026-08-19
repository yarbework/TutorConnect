import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorProfile, VerificationStatus } from './entities/tutor-profile.entity';
import { User } from '../auth/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyCredentialsDto } from './dto/verify-credentials.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(TutorProfile)
    private tutorProfileRepository: Repository<TutorProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Get current tutor profile
  async getProfile(userId: string) {
    let profile = await this.tutorProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User account not found');

      profile = this.tutorProfileRepository.create({
        user,
        bio: 'Tutor profile ready for configuration.',
      });
      await this.tutorProfileRepository.save(profile);
    }

    return this.formatProfileResponse(profile);
  }

  // FR-PROF-04: Update interactive availability calendar, teaching modes, hourly rate, and radius
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    let profile = await this.tutorProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User account not found');
      profile = this.tutorProfileRepository.create({ user });
    }

    if (dto.hourlyRate !== undefined) profile.hourly_rate = dto.hourlyRate;
    if (dto.geographicRadiusKm !== undefined) profile.geographic_radius_km = dto.geographicRadiusKm;
    if (dto.bio !== undefined) profile.bio = dto.bio;

    if (dto.teachingModes !== undefined) {
      profile.teaching_modes = dto.teachingModes;
    }

    if (dto.availabilityCalendar !== undefined) {
      try {
        JSON.parse(dto.availabilityCalendar);
        profile.availability_calendar = dto.availabilityCalendar;
      } catch (e) {
        throw new BadRequestException('availabilityCalendar must be a valid JSON string');
      }
    }

    const updated = await this.tutorProfileRepository.save(profile);
    return this.formatProfileResponse(updated);
  }

  // FR-PROF-03: Upload background credentials PDF document -> Tags as PENDING_AUDIT
  async uploadCredentials(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Please provide a PDF file for background credentials.');
    }

    if (!file.originalname.toLowerCase().endsWith('.pdf') && file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF documents (.pdf) are allowed for credentials upload.');
    }

    let profile = await this.tutorProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User account not found');
      profile = this.tutorProfileRepository.create({ user });
    }

    profile.credential_pdf_url = `/uploads/${file.filename}`;
    profile.credential_filename = file.originalname;
    profile.uploaded_at = new Date();
    profile.verification_status = VerificationStatus.PENDING_AUDIT;
    profile.admin_review_note = null;

    const updated = await this.tutorProfileRepository.save(profile);

    return {
      message: '✅ Background credential PDF uploaded successfully! Document tagged as PENDING_AUDIT.',
      verificationStatus: updated.verification_status,
      credentialPdfUrl: updated.credential_pdf_url,
      credentialFilename: updated.credential_filename,
      profile: this.formatProfileResponse(updated),
    };
  }

  // FR-PROF-03: Get all pending audit credential reviews for Admin
  async getPendingAudits() {
    const list = await this.tutorProfileRepository.find({
      where: { verification_status: VerificationStatus.PENDING_AUDIT },
      relations: ['user'],
      order: { uploaded_at: 'DESC' },
    });

    return list.map((item) => this.formatProfileResponse(item));
  }

  // FR-PROF-03: Admin Verification Action (APPROVE / REJECT)
  async verifyCredentials(profileId: string, dto: VerifyCredentialsDto) {
    const profile = await this.tutorProfileRepository.findOne({
      where: { id: profileId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Tutor profile record not found');
    }

    profile.verification_status = dto.status;
    profile.admin_review_note = dto.note || `Status updated to ${dto.status} by Admin audit decision.`;
    profile.reviewed_at = new Date();

    const updated = await this.tutorProfileRepository.save(profile);

    return {
      message: `✅ Tutor credential verification audit updated to ${dto.status}.`,
      profileId: updated.id,
      tutorName: updated.user?.email || 'Tutor',
      verificationStatus: updated.verification_status,
      adminReviewNote: updated.admin_review_note,
      reviewedAt: updated.reviewed_at,
    };
  }

  private formatProfileResponse(profile: TutorProfile) {
    let parsedCalendar = {};
    try {
      if (profile.availability_calendar) {
        parsedCalendar = JSON.parse(profile.availability_calendar);
      }
    } catch (e) {}

    return {
      id: profile.id,
      userId: profile.user?.id,
      userEmail: profile.user?.email,
      role: profile.user?.role,
      bio: profile.bio,
      hourlyRate: Number(profile.hourly_rate || 40),
      teachingModes: profile.teaching_modes || ['ONLINE'],
      geographicRadiusKm: profile.geographic_radius_km || 15,
      availabilityCalendar: parsedCalendar,
      credentialPdfUrl: profile.credential_pdf_url,
      credentialFilename: profile.credential_filename,
      uploadedAt: profile.uploaded_at,
      verificationStatus: profile.verification_status,
      adminReviewNote: profile.admin_review_note,
      reviewedAt: profile.reviewed_at,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
