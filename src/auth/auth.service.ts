import { 
  Injectable, 
  ConflictException, 
  InternalServerErrorException, 
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  Inject,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HashingService } from '../common/services/hashing.service';
import { EmailService } from '../common/services/email.service';
import { REDIS_CLIENT } from '../common/providers/redis.provider';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly VERIFICATION_TOKEN_TTL = 86400;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      if (error.code === '23505') {
        throw new ConflictException('A user with this email address already exists.');
      }
      this.logger.error('Database error during user registration', error.stack);
      throw new InternalServerErrorException('An error occurred during registration.');
    }

    try {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const redisKey = `email_verification:${verificationToken}`;
      await this.redisClient.setex(redisKey, this.VERIFICATION_TOKEN_TTL, savedUser.id);

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

    const updateResult = await this.userRepository.update({ id: userId }, { is_email_verified: true });

    if (updateResult.affected === 0) {
      throw new InternalServerErrorException('Failed to update verification status.');
    }

    await this.redisClient.del(redisKey);
    return { message: 'Email successfully verified. You may now log in.' };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashingService.verify(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_email_verified) {
      throw new ForbiddenException('Please verify your email address before logging in.');
    }

    const tokens = await this.generateTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update({ id: userId }, { refresh_token_hash: null });
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user || !user.refresh_token_hash) {
      throw new ForbiddenException('Access Denied: Invalid session');
    }

    const refreshTokenHash = this.hashStringSha256(refreshToken);
    if (user.refresh_token_hash !== refreshTokenHash) {
      throw new ForbiddenException('Access Denied: Token mismatch');
    }

    const tokens = await this.generateTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(userId: string, role: string): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, role },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') as any,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hash = this.hashStringSha256(refreshToken);
    await this.userRepository.update({ id: userId }, { refresh_token_hash: hash });
  }

  private hashStringSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}