import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { TutorProfile } from './entities/tutor-profile.entity';
import { AuthModule } from '../auth/auth.module'; // Needed so JwtAuthGuard and RolesGuard are recognized

@Module({
  imports: [
    TypeOrmModule.forFeature([TutorProfile]),
    AuthModule,
  ],
  controllers: [TutorController],
  providers: [TutorService],
  exports: [TutorService],
})
export class TutorModule {}