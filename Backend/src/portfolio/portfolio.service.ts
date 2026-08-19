import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyCredentialsDto } from './dto/verify-credentials.dto';
import { VerificationStatus } from '../common/enums/verification-status.enum';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  // Get current tutor profile
  async getProfile(userId: string) {
    let profile = await this.prisma.tutorProfile.findUnique({
      where: { userId },
      include: { user: { select: { id: true, fullName: true, email: true, role: true } } },
    });

    if (!profile) {
      // Auto-create profile if missing
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User account not found');

      profile = await this.prisma.tutorProfile.create({
        data: {
          userId,
          bio: 'Tutor profile ready for configuration.',
        },
        include: { user: { select: { id: true, fullName: true, email: true, role: true } } },
      });
    }

    return this.formatProfileResponse(profile);
  }

  // FR-PROF-04: Update interactive availability calendar, teaching modes, hourly rate, and radius
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const existing = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!existing) {
      throw new NotFoundException('Tutor profile not found for this user');
    }

    const updateData: any = {};

    if (dto.hourlyRate !== undefined) updateData.hourlyRate = dto.hourlyRate;
    if (dto.geographicRadiusKm !== undefined) updateData.geographicRadiusKm = dto.geographicRadiusKm;
    if (dto.bio !== undefined) updateData.bio = dto.bio;

    if (dto.teachingModes !== undefined) {
      updateData.teachingModes = JSON.stringify(dto.teachingModes);
    }

    if (dto.availabilityCalendar !== undefined) {
      // Validate JSON structure
      try {
        JSON.parse(dto.availabilityCalendar);
        updateData.availabilityCalendar = dto.availabilityCalendar;
      } catch (e) {
        throw new BadRequestException('availabilityCalendar must be a valid JSON string');
      }
    }

    const updated = await this.prisma.tutorProfile.update({
      where: { userId },
      data: updateData,
      include: { user: { select: { id: true, fullName: true, email: true, role: true } } },
    });

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

    const fileUrl = `/uploads/${file.filename}`;

    const updated = await this.prisma.tutorProfile.update({
      where: { userId },
      data: {
        credentialPdfUrl: fileUrl,
        credentialFilename: file.originalname,
        uploadedAt: new Date(),
        verificationStatus: VerificationStatus.PENDING_AUDIT, // FR-PROF-03 Required Tag
        adminReviewNote: null,
      },
      include: { user: { select: { id: true, fullName: true, email: true, role: true } } },
    });

    return {
      message: '✅ Background credential PDF uploaded successfully! Document tagged as PENDING_AUDIT.',
      verificationStatus: updated.verificationStatus,
      credentialPdfUrl: updated.credentialPdfUrl,
      credentialFilename: updated.credentialFilename,
      profile: this.formatProfileResponse(updated),
    };
  }

  // FR-PROF-03: Get all pending audit credential reviews for Admin
  async getPendingAudits() {
    const list = await this.prisma.tutorProfile.findMany({
      where: { verificationStatus: VerificationStatus.PENDING_AUDIT },
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { uploadedAt: 'desc' },
    });

    return list.map((item) => this.formatProfileResponse(item));
  }

  // FR-PROF-03: Admin Verification Action (APPROVE / REJECT)
  async verifyCredentials(profileId: string, dto: VerifyCredentialsDto) {
    const profile = await this.prisma.tutorProfile.findUnique({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException('Tutor profile record not found');
    }

    const updated = await this.prisma.tutorProfile.update({
      where: { id: profileId },
      data: {
        verificationStatus: dto.status,
        adminReviewNote: dto.note || `Status updated to ${dto.status} by Admin audit decision.`,
        reviewedAt: new Date(),
      },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });

    return {
      message: `✅ Tutor credential verification audit updated to ${dto.status}.`,
      profileId: updated.id,
      tutorName: updated.user.fullName,
      verificationStatus: updated.verificationStatus,
      adminReviewNote: updated.adminReviewNote,
      reviewedAt: updated.reviewedAt,
    };
  }

  // Helper to parse JSON strings back to native JS arrays/objects for REST response
  private formatProfileResponse(profile: any) {
    let parsedTeachingModes = ['ONLINE', 'IN_PERSON_TUTOR_HOME', 'IN_PERSON_STUDENT_HOME'];
    let parsedCalendar = {};

    try {
      if (profile.teachingModes) parsedTeachingModes = JSON.parse(profile.teachingModes);
    } catch (e) {}

    try {
      if (profile.availabilityCalendar) parsedCalendar = JSON.parse(profile.availabilityCalendar);
    } catch (e) {}

    return {
      ...profile,
      teachingModes: parsedTeachingModes,
      availabilityCalendar: parsedCalendar,
    };
  }
}
