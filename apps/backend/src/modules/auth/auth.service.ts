import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { Prisma, type User } from '../../generated/prisma/client.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ResendOtpDto } from './dto/resend-otp.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { OtpService } from './otp.service.js';
export const SALT_ROUNDS = 12;

const OTP_SENT = 'Verification code sent to your email';
const EMAIL_TAKEN = 'Email is already registered';
const NAME_TAKEN = 'This name is taken, try another one';
// Compared against when the email is unknown, so login takes the same time either way
const DUMMY_HASH = bcrypt.hashSync('dummy-password', SALT_ROUNDS);

// JWT's `sub` is a string ("1") while users.id is a number; anything else (e.g. an old uuid token) gives null
export const userIdFromSub = (sub: unknown) => {
  const id = Number(sub);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly otp: OtpService,
  ) {}

  async register({ name, email, password }: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { name }] },
      select: { email: true },
    });
    if (existing)
      throw new ConflictException(
        existing.email === email ? EMAIL_TAKEN : NAME_TAKEN,
      );
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const registrationId = await this.otp.createPending({
      name,
      email,
      password: hashed,
    });
    return { message: OTP_SENT, email, registrationId };
  }

  async verifyOtp({ registrationId, code }: VerifyOtpDto) {
    const pending = await this.otp.verify(registrationId, code);
    if (!pending) throw new BadRequestException('Invalid or expired code');
    try {
      const user = await this.prisma.user.create({ data: pending });
      return this.issueToken(user);
    } catch (error) {
      // Two signups with the same email or name can both be pending; the first one verified wins
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `${EMAIL_TAKEN}, or ${NAME_TAKEN.toLowerCase()}`,
        );
      }
      throw error;
    }
  }

  async resendOtp({ registrationId }: ResendOtpDto) {
    await this.otp.resend(registrationId);
    return { message: OTP_SENT };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const valid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
    if (!user || !valid)
      throw new UnauthorizedException('Invalid email or password');
    return this.issueToken(user);
  }

  /** Checks the cookie's JWT (signature + expiry) and that the user still exists. */
  async validate(token?: string) {
    if (!token) return { authenticated: false as const };
    let payload: { sub: string; email: string; exp: number };
    try {
      payload = await this.jwt.verifyAsync(token);
    } catch {
      return { authenticated: false as const };
    }
    const id = userIdFromSub(payload.sub);
    if (!id) return { authenticated: false as const };
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
    if (!user) return { authenticated: false as const };
    return {
      authenticated: true as const,
      user,
      expiresAt: new Date(payload.exp * 1000),
    };
  }

  private async issueToken({ id, name, email }: User) {
    const token = await this.jwt.signAsync({ sub: String(id), email });
    const { exp } = this.jwt.decode<{ exp: number }>(token);
    return {
      user: { id, name, email },
      token,
      expiresAt: new Date(exp * 1000),
    };
  }
}
