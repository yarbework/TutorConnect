import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { JobInvitation } from './entities/job-invitation.entity';
import { JobApplication } from './entities/job-application.entity'; // ⭐️ Add
import { Wallet } from './entities/wallet.entity';                   // ⭐️ Add
import { WalletTransaction } from './entities/wallet-transaction.entity'; // ⭐️ Add
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobPost, 
      JobInvitation,
      JobApplication, 
      Wallet,
      WalletTransaction
    ]), 
    AuthModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}