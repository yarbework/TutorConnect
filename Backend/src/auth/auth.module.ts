import { HashingService } from './../common/services/hashing.service';
import { redisProvider } from '../common/providers/redis.provider'; 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from './entities/user.entity';
import { CommonModule } from '../common/common.module';
// 1. Import the JwtStrategy (adjust the path based on where it lives!)
import { JwtStrategy } from './strategies/jwt.strategy'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { 
          expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m') as any 
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    HashingService,
    redisProvider,
    JwtStrategy // 2. Add it right here!
  ],
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}