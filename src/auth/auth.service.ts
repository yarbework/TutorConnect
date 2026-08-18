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

  // ... (Keep existing register and verifyEmail methods exactly as they were) ...

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
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
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