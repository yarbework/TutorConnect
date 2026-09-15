import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {JwtModule} from '@nestjs/jwt';
import { Engagement } from './entities/engagement.entity';
import { EngagementMessage } from './entities/engagement-message.entity';
import { EngagementsService } from './engagements.service';
import { EngagementsController } from './engagements.controller';
import {EngagementsGateway} from './engagements.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Engagement, EngagementMessage]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'tutorconnect_super_secret_jwt_key_2026',
    }),
  ],
  controllers: [EngagementsController],
  providers: [EngagementsService, EngagementsGateway],
  exports: [EngagementsService, EngagementsGateway], 
})
export class EngagementsModule {}