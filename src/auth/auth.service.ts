import { 
  Injectable, 
  ConflictException, 
  InternalServerErrorException, 
  BadRequestException,
  Inject,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import * as crypto from 'crypto';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { HashingService } from '../common/services/hashing.service';
import { EmailService } from '../common/services/email.service';
import { REDIS_CLIENT } from '../common/providers/redis.provider';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly VERIFICATION_TOKEN_TTL = 86400; // 24 hours in seconds

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly emailService: EmailService,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, role } = registerDto;

    const password_hash = await this.hashingService.hash(password);
    
    const newUser = this.userRepository.create({
      email,
      password_hash,
      role: role || UserRole.GUARDIAN,
    });

    let savedUser: User;
    try {
      savedUser = await this.userRepository.save(newUser);
    } catch (error: any) {
      // Catch PostgreSQL unique violation error code
      if (error.code === '23505') {
        throw new ConflictException('A user with this email address already exists.');
      }
      this.logger.error('Database error during user registration', error.stack);
      throw new InternalServerErrorException('An error occurred during registration.');
    }

    try {
      // Generate a highly secure random token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Store token in Redis mapping to the userId with a 24-hour expiration
      const redisKey = `email_verification:${verificationToken}`;
      await this.redisClient.setex(redisKey, this.VERIFICATION_TOKEN_TTL, savedUser.id);

      // Dispatch the email asynchronously without awaiting the full network roundtrip for response
      this.emailService.sendVerificationEmail(savedUser.email, verificationToken).catch((err) => {
        this.logger.error(`Failed to send verification email to ${savedUser.email}`, err.stack);
      });

      return { message: 'Registration successful. Please check your email to verify your account.' };
    } catch (error: any) {
      this.logger.error('Redis error during token generation', error.stack);
      throw new InternalServerErrorException('User created, but email dispatch failed.');
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Verification token is required.');
    }

    const redisKey = `email_verification:${token}`;
    const userId = await this.redisClient.get(redisKey);

    if (!userId) {
      throw new BadRequestException('Invalid or expired verification token.');
    }

    const updateResult = await this.userRepository.update(
      { id: userId },
      { is_email_verified: true }
    );

    if (updateResult.affected === 0) {
      throw new InternalServerErrorException('Failed to update verification status.');
    }

    // Evict the token to prevent reuse
    await this.redisClient.del(redisKey);

    return { message: 'Email successfully verified. You may now log in.' };
  }
}