import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ResendOtpDto } from './dto/resend-otp.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
export const AUTH_COOKIE = 'access_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token, expiresAt } = await this.auth.login(dto);
    this.setAuthCookie(res, token, expiresAt);
    return { user, expiresAt };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token, expiresAt } = await this.auth.verifyOtp(dto);
    this.setAuthCookie(res, token, expiresAt);
    return { user, expiresAt };
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.auth.resendOtp(dto);
  }

  @Get('validate')
  validate(@Req() req: Request) {
    return this.auth.validate(req.cookies?.[AUTH_COOKIE] as string | undefined);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE, this.cookieOptions());
    return { message: 'Logged out' };
  }

  private setAuthCookie(res: Response, token: string, expires: Date) {
    res.cookie(AUTH_COOKIE, token, { ...this.cookieOptions(), expires });
  }

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    };
  }
}
