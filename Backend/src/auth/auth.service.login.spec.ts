import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { HashingService } from '../common/services/hashing.service';
import { EmailService } from '../common/services/email.service';
import { REDIS_CLIENT } from '../common/providers/redis.provider';

describe('AuthService - Login & Token Generation', () => {
  let authService: AuthService;
  let mockUserRepository: any;
  let mockHashingService: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    mockHashingService = {
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: HashingService, useValue: mockHashingService },
        { provide: JwtService, useValue: { signAsync: jest.fn().mockResolvedValue('jwt_token') } },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('secret') } },
        { provide: EmailService, useValue: { sendVerificationEmail: jest.fn() } },
        { provide: REDIS_CLIENT, useValue: { get: jest.fn(), setex: jest.fn(), del: jest.fn() } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should throw UnauthorizedException for non-existent email', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    await expect(authService.login({ email: 'fake@ex.com', password: 'pw' })).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    mockUserRepository.findOne.mockResolvedValue({ password_hash: 'hash' });
    mockHashingService.verify.mockResolvedValue(false);
    await expect(authService.login({ email: 'test@ex.com', password: 'wrong' })).rejects.toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException if email is not verified', async () => {
    mockUserRepository.findOne.mockResolvedValue({ password_hash: 'hash', is_email_verified: false });
    mockHashingService.verify.mockResolvedValue(true);
    await expect(authService.login({ email: 'test@ex.com', password: 'pw' })).rejects.toThrow(ForbiddenException);
  });

  it('should return tokens and update refresh hash on successful login', async () => {
    mockUserRepository.findOne.mockResolvedValue({ id: '123', password_hash: 'hash', is_email_verified: true, role: 'TUTOR' });
    mockHashingService.verify.mockResolvedValue(true);
    mockUserRepository.update.mockResolvedValue({ affected: 1 });

    const tokens = await authService.login({ email: 'test@ex.com', password: 'pw' });

    expect(tokens.accessToken).toEqual('jwt_token');
    expect(tokens.refreshToken).toEqual('jwt_token');
    expect(mockUserRepository.update).toHaveBeenCalled();
  });
});