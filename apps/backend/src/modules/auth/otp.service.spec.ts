import { jest } from '@jest/globals';
import { BadRequestException, HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MailService } from '../../infra/mail/mail.service.js';
import { RedisService } from '../../infra/redis/redis.service.js';
import { OtpService } from './otp.service.js';

// Minimal in-memory stand-in for the few Redis commands OtpService uses (TTLs are ignored)
class FakeRedis {
  strings = new Map<string, string>();
  hashes = new Map<string, Record<string, string>>();
  set = (key: string, value: string, ...args: unknown[]) => {
    if (args.includes('NX') && this.strings.has(key))
      return Promise.resolve(null);
    this.strings.set(key, value);
    return Promise.resolve('OK');
  };
  del = (...keys: string[]) =>
    Promise.resolve(
      keys.filter((k) => this.strings.delete(k) || this.hashes.delete(k))
        .length,
    );
  hset = (key: string, fields: Record<string, string | number>) => {
    const entries = Object.entries(fields).map(([k, v]) => [k, String(v)]);
    this.hashes.set(key, {
      ...this.hashes.get(key),
      ...Object.fromEntries(entries),
    });
    return Promise.resolve(entries.length);
  };
  hget = (key: string, field: string) =>
    Promise.resolve(this.hashes.get(key)?.[field] ?? null);
  hgetall = (key: string) => Promise.resolve({ ...this.hashes.get(key) });
  hincrby = (key: string, field: string, by: number) => {
    const next = Number(this.hashes.get(key)?.[field] ?? 0) + by;
    void this.hset(key, { [field]: next });
    return Promise.resolve(next);
  };
  expire = () => Promise.resolve(1);
  multi = () => {
    const ops: (() => Promise<unknown>)[] = [];
    const chain = {
      hset: (...args: Parameters<FakeRedis['hset']>) => (
        ops.push(() => this.hset(...args)),
        chain
      ),
      hincrby: (...args: Parameters<FakeRedis['hincrby']>) => (
        ops.push(() => this.hincrby(...args)),
        chain
      ),
      expire: () => (ops.push(() => this.expire()), chain),
      exec: async () => {
        const results: [null, unknown][] = [];
        for (const op of ops) results.push([null, await op()]);
        return results;
      },
    };
    return chain;
  };
}

describe('OtpService', () => {
  const user = {
    name: 'Ada',
    email: 'ada@example.com',
    password: 'bcrypt-hash',
  };
  let service: OtpService;
  let redis: FakeRedis;
  const mail = { sendOtp: jest.fn<MailService['sendOtp']>() };
  const sentCode = () => mail.sendOtp.mock.calls.at(-1)![1];
  const wrongCode = () => (sentCode() === '000000' ? '111111' : '000000');
  const endCooldown = () => redis.strings.delete(`otp-cooldown:${user.email}`);

  beforeEach(async () => {
    jest.resetAllMocks();
    redis = new FakeRedis();
    const module = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: RedisService, useValue: redis },
        { provide: MailService, useValue: mail },
      ],
    }).compile();
    service = module.get(OtpService);
  });

  it('holds the signup in Redis, emails a 6-digit code and stores only its hash', async () => {
    const id = await service.createPending(user);
    const stored = redis.hashes.get(`pending-registration:${id}`)!;
    expect(sentCode()).toMatch(/^\d{6}$/);
    expect(mail.sendOtp).toHaveBeenCalledWith(user.email, sentCode());
    expect(stored).toMatchObject(user);
    expect(stored.codeHash).not.toContain(sentCode());
  });

  it('returns the pending user for the right code, only once', async () => {
    const id = await service.createPending(user);
    const code = sentCode();
    expect(await service.verify(id, code)).toEqual(user);
    expect(await service.verify(id, code)).toBeNull();
  });

  it('ties the code to its own signup, not just the email', async () => {
    const victim = await service.createPending(user);
    const victimCode = sentCode();
    endCooldown();
    const attacker = await service.createPending({
      ...user,
      password: 'attacker-hash',
    });
    expect(
      await service.verify(
        attacker,
        victimCode === sentCode() ? wrongCode() : victimCode,
      ),
    ).toBeNull();
    expect(await service.verify(victim, victimCode)).toEqual(user);
  });

  it('burns the signup after 5 wrong attempts', async () => {
    const id = await service.createPending(user);
    const code = sentCode();
    for (let i = 0; i < 5; i++)
      expect(await service.verify(id, wrongCode())).toBeNull();
    expect(await service.verify(id, code)).toBeNull();
  });

  it('enforces the cooldown on signup and resend', async () => {
    const id = await service.createPending(user);
    await expect(service.createPending(user)).rejects.toBeInstanceOf(
      HttpException,
    );
    await expect(service.resend(id)).rejects.toBeInstanceOf(HttpException);
    expect(mail.sendOtp).toHaveBeenCalledTimes(1);
  });

  it('resend replaces the code; the old one stops working', async () => {
    const id = await service.createPending(user);
    const oldCode = sentCode();
    endCooldown();
    await service.resend(id);
    const newCode = sentCode();
    if (oldCode !== newCode)
      expect(await service.verify(id, oldCode)).toBeNull();
    expect(await service.verify(id, newCode)).toEqual(user);
  });

  it('resend of an unknown or expired signup returns 400', async () => {
    await expect(service.resend('missing')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('cleans up if the email fails to send, so the user can retry', async () => {
    mail.sendOtp.mockRejectedValueOnce(new Error('SMTP down'));
    await expect(service.createPending(user)).rejects.toThrow('SMTP down');
    expect(redis.hashes.size).toBe(0);
    await expect(service.createPending(user)).resolves.toEqual(
      expect.any(String),
    );
  });
});
