import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AUTH_COOKIE } from './auth.controller.js';
import { userIdFromSub } from './auth.service.js';

export interface AuthUser {
  id: number;
  email: string;
}

// Lets a request through only with a valid auth cookie, and puts the user on req.user
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    const token = req.cookies?.[AUTH_COOKIE] as string | undefined;
    if (!token) throw new UnauthorizedException('Please log in');
    let payload: { sub: string; email: string };
    try {
      payload = await this.jwt.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Session expired, please log in again');
    }
    const id = userIdFromSub(payload.sub);
    if (!id) throw new UnauthorizedException('Please log in again');
    req.user = { id, email: payload.email };
    return true;
  }
}
