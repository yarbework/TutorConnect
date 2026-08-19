import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashingService {
  private readonly logger = new Logger(HashingService.name);

  private readonly hashOptions = {
    // Explicitly cast to the literal type 2 (Argon2id) required by the library definitions
    type: argon2.argon2id as 2, 
    memoryCost: 19456, 
    timeCost: 2,       
    parallelism: 1,    
  };

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