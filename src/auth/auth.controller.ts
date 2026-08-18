import { Controller, Post, Body, Get, Query, Res, Req, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import type { Response, Request } from 'express';
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

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(loginDto);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return tokens;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'] || req.body.refreshToken;
    const userId = req.body.userId; 

    if (!refreshToken || !userId) {
      throw new BadRequestException('Refresh token and user ID are required');
    }

    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.body.userId; 
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
      path: '/api/v1/auth/refresh',
    });
  }
}