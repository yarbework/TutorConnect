import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      // Extract from the standard Authorization Bearer header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Reject expired tokens immediately
      ignoreExpiration: false,
      // Use the access secret to verify the cryptographic signature
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') as string,
    });
  }

  /**
   * Once the signature is verified, this method receives the decoded JSON payload.
   * We map it to a standard user object that NestJS attaches to the Request.
   */
  async validate(payload: any): Promise<{ userId: string; role: string }> {
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException('Invalid token payload structure');
    }
    
    return { 
      userId: payload.sub, 
      role: payload.role 
    };
  }
}