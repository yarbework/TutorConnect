import { Controller, Post, Body, Get, Query, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // ... (Keep existing register and verifyEmail methods) ...

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(loginDto);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return tokens; // Both tokens returned for mobile extraction, cookie set for web
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // Attempt to extract from Secure Cookie first (Web), fallback to Auth Header / Body (Mobile)
    const refreshToken = req.cookies['refresh_token'] || req.body.refreshToken;
    
    // In Phase 5, we will extract userId from the Access Token using Guards. 
    // For now, we simulate extraction from the refresh request body.
    const userId = req.body.userId; 

    if (!refreshToken || !userId) {
      throw new HttpCode(HttpStatus.BAD_REQUEST);
    }

    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.body.userId; // Will be extracted securely from JWT in Phase 5
    if (userId) {
      await this.authService.logout(userId);
    }
    res.clearCookie('refresh_token');
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    const expiresInDays = 7; 
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: expiresInDays * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh', // Restrict cookie transmission to the refresh endpoint only
    });
  }
}