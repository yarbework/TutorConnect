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
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') as string,
    });
  }


  async validate(payload: any): Promise<{ userId: string; role: string; email?: string }> {
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException('Invalid token payload structure');
    }
    
    return { 
      userId: payload.sub, 
      email: payload.email,
      role: payload.role 
    };
  }
}