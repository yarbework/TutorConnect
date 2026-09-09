import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { JobApplication, ApplicationStatus } from './entities/job-application.entity';
import {Wallet} from './entities/wallet.entity';
import {WalletTransaction, TransactionType, TransactionReason} from './entities/wallet-transaction.entity';
import {ApplyJobDto} from './dto/apply-job.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { JobStateMachine } from './utils/job-state-machine';
import { ExploreJobsDto } from './dto/explore-jobs.dto';
import { JobStatus } from './enums/job.enums';
import { JobInvitation, InvitationStatus } from './entities/job-invitation.entity';
import { CreateInvitationDto, RespondInvitationDto } from './dto/invitation.dto';

const APPLICATION_CONNECTS_COST = 2; 

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    @InjectRepository(JobInvitation)
    private readonly invitationRepo: Repository<JobInvitation>,
    @InjectRepository(JobApplication)
    private readonly applicationRepo: Repository<JobApplication>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    private readonly dataSource: DataSource,
  ) {}

  async createJob(guardianId: string, createJobDto: CreateJobPostDto): Promise<JobPost> {
    const newJob = this.jobPostRepository.create({
      ...createJobDto,
      guardian_id: guardianId,
    });
    return this.jobPostRepository.save(newJob);
  }

  async getJobsByGuardian(guardianId: string): Promise<JobPost[]> {
    return this.jobPostRepository.find({
      where: { guardian_id: guardianId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateJobStatus(
    jobId: string,
    guardianId: string,
    updateJobStatusDto: UpdateJobStatusDto,
  ): Promise<JobPost> {
    const job = await this.jobPostRepository.findOne({ where: { id: jobId } });

    if (!job) {
      throw new NotFoundException('Job post not found');
    }

    if (job.guardian_id !== guardianId) {
      throw new ForbiddenException('You do not have permission to modify this job');
    }

    // Enforce the Finite State Machine rules
    JobStateMachine.validateTransition(job.status, updateJobStatusDto.status);

    job.status = updateJobStatusDto.status;
    return this.jobPostRepository.save(job);
  }

  async exploreJobs(filters: ExploreJobsDto): Promise<JobPost[]> {
    const query = this.jobPostRepository.createQueryBuilder('job');

    // Security check: Only fetch active, published posts
    query.where('job.status = :status', { status: JobStatus.PUBLISHED });

    if (filters.subject) {
      query.andWhere('job.subject ILIKE :subject', { subject: `%${filters.subject}%` });
    }

    if (filters.grade_level) {
      query.andWhere('job.grade_level = :grade_level', { grade_level: filters.grade_level });
    }

    if (filters.min_budget) {
      query.andWhere('job.max_hourly_budget >= :min_budget', { min_budget: filters.min_budget });
    }

    if (filters.teaching_mode) {
      query.andWhere('job.teaching_mode = :teaching_mode', { teaching_mode: filters.teaching_mode });
    }

    if (filters.city) {
      query.andWhere('job.city ILIKE :city', { city: `%${filters.city}%` });
    }

    query.orderBy('job.createdAt', 'DESC');
    return query.getMany();
  }

  async sendInvitation(guardianId: string, dto: CreateInvitationDto): Promise<JobInvitation> {
  const job = await this.jobPostRepository.findOne({ where: { id: dto.job_id } });
  if (!job) {
    throw new NotFoundException('Job post not found');
  }
  if (job.guardian_id !== guardianId) {
    throw new ForbiddenException('You do not own this job posting');
  }

  const invitation = this.invitationRepo.create({
    job_id: dto.job_id,
    guardian_id: guardianId,
    tutor_id: dto.tutor_id,
    message: dto.message,
    status: InvitationStatus.PENDING,
  });

  return this.invitationRepo.save(invitation);
}


async getTutorInvitations(tutorId: string): Promise<JobInvitation[]> {
  return this.invitationRepo.find({
    where: { tutor_id: tutorId },
    relations: {
      job: true,
      guardian: true,
    },
    order: { createdAt: 'DESC' },
  });
}


async respondToInvitation(
  invitationId: string,
  tutorId: string,
  dto: RespondInvitationDto,
): Promise<JobInvitation> {
  const invitation = await this.invitationRepo.findOne({
    where: { id: invitationId },
    relations: { job: true },
  });

  if (!invitation) {
    throw new NotFoundException('Invitation not found');
  }
  if (invitation.tutor_id !== tutorId) {
    throw new ForbiddenException('You cannot respond to another tutor’s invitation');
  }

  invitation.status = dto.status;
  return this.invitationRepo.save(invitation);
}

async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) {
      wallet = this.walletRepo.create({
        userId,
        balance: 10, 
      });
      await this.walletRepo.save(wallet);
    }
    return wallet;
  }

  async applyToJob(
    jobId: string,
    tutorId: string,
    dto: ApplyJobDto,
  ): Promise<JobApplication> {
    const job = await this.jobPostRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job post not found');
    }
    if (job.status !== JobStatus.PUBLISHED) {
      throw new BadRequestException('You can only apply to PUBLISHED jobs');
    }

    const existing = await this.applicationRepo.findOne({
      where: { job_id: jobId, tutor_id: tutorId },
    });
    if (existing) {
      throw new ConflictException('You have already applied to this job post');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId: tutorId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!wallet) {
        wallet = queryRunner.manager.create(Wallet, {
          userId: tutorId,
          balance: 10,
        });
        await queryRunner.manager.save(wallet);
      }

    if (wallet.balance < APPLICATION_CONNECTS_COST) {
        throw new HttpException(
          {
            statusCode: HttpStatus.PAYMENT_REQUIRED, // HTTP 402
            message: `Insufficient Connects. Applying requires ${APPLICATION_CONNECTS_COST} Connects, but your current balance is ${wallet.balance}.`,
            error: 'Payment Required',
          },
          HttpStatus.PAYMENT_REQUIRED,
        );
      }

      wallet.balance -= APPLICATION_CONNECTS_COST;
      await queryRunner.manager.save(wallet);

  const auditLog = queryRunner.manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount: -APPLICATION_CONNECTS_COST,
        type: TransactionType.DEBIT,
        reason: TransactionReason.JOB_APPLICATION,
        referenceId: jobId,
        description: `Applied to job: "${job.title}"`,
      });
      await queryRunner.manager.save(auditLog); 
  
  const application = queryRunner.manager.create(JobApplication, {
        job_id: jobId,
        tutor_id: tutorId,
        pitch_message: dto.pitch_message,
        proposed_rate: dto.proposed_rate,
        video_pitch_url: dto.video_pitch_url || null,
        status: ApplicationStatus.SUBMITTED,
      });
      const savedApplication = await queryRunner.manager.save(application);

      await queryRunner.commitTransaction();

      return savedApplication;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getJobApplicants(jobId: string, guardianId: string): Promise<JobApplication[]> {
    const job = await this.jobPostRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job post not found');
    }
    if (job.guardian_id !== guardianId) {
      throw new ForbiddenException('You do not own this job post');
    }

    return this.applicationRepo.find({
      where: { job_id: jobId },
      relations: {
        tutor: true,
      },
      order: { createdAt: 'DESC' },
    });
  }


  async getMyApplications(tutorId: string): Promise<JobApplication[]> {
    return this.applicationRepo.find({
      where: { tutor_id: tutorId },
      relations: {
        job: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async reviewApplication(
    applicationId: string,
    guardianId: string,
    dto: ReviewApplicationDto,
  ): Promise<JobApplication> {
    const application = await this.applicationRepo.findOne({
      where: { id: applicationId },
      relations: { job: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }
    if (application.job.guardian_id !== guardianId) {
      throw new ForbiddenException('You do not have permission to review applications for this job');
    }

    application.status = dto.status;
    const saved = await this.applicationRepo.save(application);

    if (dto.status === ApplicationStatus.ACCEPTED) {
      application.job.status = JobStatus.AWARDED;
      await this.jobPostRepository.save(application.job);
    }

    return saved;
  }

}