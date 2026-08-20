import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TutorProfile } from './entities/tutor-profile.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TutorProfile, User])],
  providers: [PortfolioService],
  controllers: [PortfolioController],
  exports: [PortfolioService, TypeOrmModule],
})
export class PortfolioModule {}
