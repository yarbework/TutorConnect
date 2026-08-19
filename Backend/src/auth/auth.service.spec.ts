import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { HashingService } from '../common/services/hashing.service';
import { EmailService } from '../common/services/email.service';
import { REDIS_CLIENT } from '../common/providers/redis.provider';

describe('AuthService Registration & Verification', () => {
  let authService: AuthService;
  let mockRedisClient: any;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockRedisClient = {
      setex: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };

    mockUserRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: HashingService, useValue: { hash: jest.fn().mockResolvedValue('hashed_pwd') } },
        { provide: EmailService, useValue: { sendVerificationEmail: jest.fn().mockResolvedValue(true) } },
        { provide: REDIS_CLIENT, useValue: mockRedisClient },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should throw ConflictException if Postgres unique constraint fails (23505)', async () => {
    mockUserRepository.save.mockRejectedValue({ code: '23505' });
    
    await expect(authService.register({
      email: 'test@example.com',
      password: 'Password123!',
      role: UserRole.TUTOR
    })).rejects.toThrow(ConflictException);
  });

  it('should verify email and delete token from Redis on success', async () => {
    const validToken = 'valid_token_string';
    const userId = 'user-uuid-123';
    
    mockRedisClient.get.mockResolvedValue(userId);
    mockUserRepository.update.mockResolvedValue({ affected: 1 });

    const result = await authService.verifyEmail(validToken);

    expect(mockRedisClient.get).toHaveBeenCalledWith(`email_verification:${validToken}`);
    expect(mockUserRepository.update).toHaveBeenCalledWith({ id: userId }, { is_email_verified: true });
    expect(mockRedisClient.del).toHaveBeenCalledWith(`email_verification:${validToken}`);
    expect(result.message).toContain('successfully verified');
  });

  it('should throw BadRequestException if token is missing or expired in Redis', async () => {
    mockRedisClient.get.mockResolvedValue(null);
    await expect(authService.verifyEmail('expired_token')).rejects.toThrow(BadRequestException);
  });
});