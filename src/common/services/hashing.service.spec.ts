import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash() and verify() flow', () => {
    it('should correctly hash and verify a valid password', async () => {
      const plaintext = 'EnterpriseSecurePass2026!';
      const hash = await service.hash(plaintext);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(plaintext);
      
      const isMatch = await service.verify(plaintext, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false when verifying an incorrect password', async () => {
      const plaintext = 'ValidPassword123!';
      const hash = await service.hash(plaintext);
      
      const isMatch = await service.verify('WrongPassword123!', hash);
      expect(isMatch).toBe(false);
    });

    it('should throw an error when attempting to hash an empty string', async () => {
      await expect(service.hash('')).rejects.toThrow('Cannot hash an empty value');
    });

    it('should return false when verifying with missing parameters', async () => {
      const isMatch = await service.verify('', 'somehash');
      expect(isMatch).toBe(false);
    });
  });
});