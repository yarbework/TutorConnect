import { Global, Module } from '@nestjs/common';
import { HashingService } from './services/hashing.service';
import { EmailService } from './services/email.service';
import { redisProvider, REDIS_CLIENT } from './providers/redis.provider';

@Global()
@Module({
  providers: [HashingService, EmailService, redisProvider],
  exports: [HashingService, EmailService, REDIS_CLIENT],
})
export class CommonModule {}