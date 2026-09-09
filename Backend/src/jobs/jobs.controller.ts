import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Patch, 
  Param, 
  UseGuards, 
  Req,
  Query, 
  ParseUUIDPipe,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { ExploreJobsDto } from './dto/explore-jobs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { CreateInvitationDto, RespondInvitationDto } from './dto/invitation.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';


@Controller('api/v1/jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles(UserRole.GUARDIAN)
  async createJob(
    @Req() req: any,
    @Body() createJobDto: CreateJobPostDto,
  ) {
    return this.jobsService.createJob(req.user.userId, createJobDto);
  }

  @Get('my-posts')
  @Roles(UserRole.GUARDIAN)
  async getMyJobs(@Req() req: any) {
    return this.jobsService.getJobsByGuardian(req.user.userId);
  }

  @Get('explore')
  @Roles(UserRole.TUTOR)
  async explorePublicJobs(@Query() filters: ExploreJobsDto) {
    return this.jobsService.exploreJobs(filters);
  }

  @Post('invitations')
@Roles(UserRole.GUARDIAN)
async sendInvitation(@Req() req: any, @Body() dto: CreateInvitationDto) {
  return this.jobsService.sendInvitation(req.user.userId, dto);
}

@Get('invitations/my-invitations')
@Roles(UserRole.TUTOR)
async getMyInvitations(@Req() req: any) {
  return this.jobsService.getTutorInvitations(req.user.userId);
}

@Patch('invitations/:id/respond')
@Roles(UserRole.TUTOR)
async respondToInvitation(
  @Req() req: any,
  @Param('id') id: string,
  @Body() dto: RespondInvitationDto,
) {
  return this.jobsService.respondToInvitation(id, req.user.userId, dto);
}

  @Patch(':id/status')
  @Roles(UserRole.GUARDIAN)
  async updateJobStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateJobStatusDto: UpdateJobStatusDto,
  ) {
    return this.jobsService.updateJobStatus(id, req.user.userId, updateJobStatusDto);
  }

  @Post(':id/apply')
  @Roles(UserRole.TUTOR)
  async applyToJob(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) jobId: string,
    @Body() dto: ApplyJobDto,
  ) {
    return this.jobsService.applyToJob(jobId, req.user.userId, dto);
  }

  @Get('applications/my-proposals')
  @Roles(UserRole.TUTOR)
  async getMyApplications(@Req() req: any) {
    return this.jobsService.getMyApplications(req.user.userId);
  }

  @Get(':id/applicants')
  @Roles(UserRole.GUARDIAN)
  async getJobApplicants(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) jobId: string,
  ) {
    return this.jobsService.getJobApplicants(jobId, req.user.userId);
  }

  @Get(':id')
  async getJobById(@Param('id', ParseUUIDPipe) jobId: string) {
    return this.jobsService.getJobById(jobId);
  }

  @Patch('applications/:id/review')
  @Roles(UserRole.GUARDIAN)
  async reviewApplication(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) applicationId: string,
    @Body() dto: ReviewApplicationDto,
  ) {
    return this.jobsService.reviewApplication(applicationId, req.user.userId, dto);
  }

  @Get('wallet/me')
  async getMyWallet(@Req() req: any) {
    return this.jobsService.getOrCreateWallet(req.user.userId);
  }

  @Get('wallet/transactions')
  async getMyWalletTransactions(@Req() req: any) {
    return this.jobsService.getWalletTransactions(req.user.userId);
  }
}