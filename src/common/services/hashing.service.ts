import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashingService {
  private readonly logger = new Logger(HashingService.name);

  // OWASP Recommended Configuration for Argon2id
  private readonly hashOptions: argon2.Options = {
    type: argon2.argon2id,
    memoryCost: 19456, // 19 MiB
    timeCost: 2,       // 2 iterations
    parallelism: 1,    // 1 thread
  };

  /**
   * Hashes a plaintext string using Argon2id
   */
  async hash(plaintext: string): Promise<string> {
    if (!plaintext) {
      throw new InternalServerErrorException('Cannot hash an empty value');
    }
    
    try {
      return await argon2.hash(plaintext, this.hashOptions);
    } catch (error) {
      this.logger.error('Failed to hash payload', error as Error);
      throw new InternalServerErrorException('Cryptographic failure during hashing');
    }
  }

  /**
   * Compares a plaintext string against a stored Argon2id hash
   */
  async verify(plaintext: string, hash: string): Promise<boolean> {
    if (!plaintext || !hash) {
      return false;
    }

    try {
      return await argon2.verify(hash, plaintext);
    } catch (error) {
      this.logger.error('Failed to verify hash', error as Error);
      return false;
    }
  }
}