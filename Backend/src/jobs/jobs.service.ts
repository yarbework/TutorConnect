import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { JobStateMachine } from './utils/job-state-machine';
import { ExploreJobsDto } from './dto/explore-jobs.dto';
import { JobStatus } from './enums/job.enums';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
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
}