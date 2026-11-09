import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  createHash,
  randomInt,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto';
import { MailService } from '../mail/mail.service.js';
import { RedisService } from '../redis/redis.service.js';

const PENDING_TTL_SECONDS = 10 * 60;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

/** A signup waiting for its email to be verified; `password` is already a bcrypt hash. */
export interface PendingUser {
  name: string;
  email: string;
  password: string;
}

const pendingKey = (registrationId: string) =>
  `pending-registration:${registrationId}`;
const cooldownKey = (email: string) => `otp-cooldown:${email}`;
const hash = (code: string) => createHash('sha256').update(code).digest();
const newCode = () => randomInt(0, 1_000_000).toString().padStart(6, '0');

@Injectable()
export class OtpService {
  constructor(
    private readonly redis: RedisService,
    private readonly mail: MailService,
  ) {}

  /** Holds the signup in Redis and emails a code. Nothing touches Postgres until `verify` succeeds. */
  async createPending(user: PendingUser) {
    await this.claimCooldown(user.email);
    const registrationId = randomUUID();
    const code = newCode();
    const key = pendingKey(registrationId);
    await this.redis
      .multi()
      .hset(key, { ...user, codeHash: hash(code).toString('hex'), attempts: 0 })
      .expire(key, PENDING_TTL_SECONDS)
      .exec();
    await this.deliver(user.email, code, () => this.redis.del(key));
    return registrationId;
  }

  async resend(registrationId: string) {
    const key = pendingKey(registrationId);
    const email = await this.redis.hget(key, 'email');
    if (!email)
      throw new BadRequestException('Signup expired, please register again');
    await this.claimCooldown(email);
    const code = newCode();
    await this.redis
      .multi()
      .hset(key, { codeHash: hash(code).toString('hex'), attempts: 0 })
      .expire(key, PENDING_TTL_SECONDS)
      .exec();
    await this.deliver(email, code);
  }

  /** Returns the pending signup when the code is right, and removes it so it can't be used twice. */
  async verify(
    registrationId: string,
    code: string,
  ): Promise<PendingUser | null> {
    const key = pendingKey(registrationId);
    const pending = await this.redis.hgetall(key);
    if (!pending.codeHash) return null;
    // EXPIRE NX only sets a TTL if the key lost it (expired between the two calls), so it never lingers
    const [[, attempts]] = (await this.redis
      .multi()
      .hincrby(key, 'attempts', 1)
      .expire(key, PENDING_TTL_SECONDS, 'NX')
      .exec()) as [[Error | null, number]];
    // Too many wrong guesses burns the signup, so a 6-digit code can't be brute-forced
    if (attempts > MAX_ATTEMPTS) {
      await this.redis.del(key);
      return null;
    }
    if (!timingSafeEqual(Buffer.from(pending.codeHash, 'hex'), hash(code)))
      return null;
    await this.redis.del(key);
    return {
      name: pending.name,
      email: pending.email,
      password: pending.password,
    };
  }

  private async claimCooldown(email: string) {
    const allowed = await this.redis.set(
      cooldownKey(email),
      '1',
      'EX',
      RESEND_COOLDOWN_SECONDS,
      'NX',
    );
    if (!allowed) {
      throw new HttpException(
        'Please wait a minute before requesting a new code',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private async deliver(
    email: string,
    code: string,
    onFailure?: () => Promise<unknown>,
  ) {
    try {
      await this.mail.sendOtp(email, code);
    } catch (error) {
      await this.redis.del(cooldownKey(email));
      await onFailure?.();
      throw error;
    }
  }
}
