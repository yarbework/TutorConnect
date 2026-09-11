import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Engagement } from './entities/engagement.entity';
import { EngagementMessage } from './entities/engagement-message.entity';
import { EngagementsService } from './engagements.service';
import { EngagementsController } from './engagements.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Engagement, EngagementMessage]),
    AuthModule,
  ],
  controllers: [EngagementsController],
  providers: [EngagementsService],
  exports: [EngagementsService], 
})
export class EngagementsModule {}