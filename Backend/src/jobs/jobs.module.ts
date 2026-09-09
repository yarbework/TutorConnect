import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { JobInvitation } from './entities/job-invitation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, JobInvitation])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}