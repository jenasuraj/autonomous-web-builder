import { jest } from '@jest/globals';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { Prisma, type User } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService, SALT_ROUNDS } from './auth.service.js';
import { OtpService } from './otp.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  const users = {
    findUnique:
      jest.fn<
        (args: {
          where: { email: string } | { id: number };
        }) => Promise<Partial<User> | null>
      >(),
    create:
      jest.fn<(args: { data: Prisma.UserCreateInput }) => Promise<User>>(),
  };
  const otp = {
    createPending: jest.fn<OtpService['createPending']>(),
    resend: jest.fn<OtpService['resend']>(),
    verify: jest.fn<OtpService['verify']>(),
  };
  const dto = {
    name: 'Ada',
    email: 'ada@example.com',
    password: 'correct-horse',
  };
  const registrationId = '7f6c2d0e-6a3b-4c1e-9f2a-1b2c3d4e5f60';

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: { user: users } },
        { provide: OtpService, useValue: otp },
        {
          provide: JwtService,
          useValue: new JwtService({
            secret: 'test-secret',
            signOptions: { expiresIn: '1h' },
          }),
        },
      ],
    }).compile();
    service = module.get(AuthService);
    jwt = module.get(JwtService);
  });

  it('register does not touch the users table; it holds a pending signup with a 12-round hash', async () => {
    users.findUnique.mockResolvedValue(null);
    otp.createPending.mockResolvedValue(registrationId);
    const result = await service.register(dto);
    const pending = otp.createPending.mock.calls[0][0];
    expect(users.create).not.toHaveBeenCalled();
    expect(pending).toMatchObject({ name: 'Ada', email: dto.email });
    expect(bcrypt.getRounds(pending.password)).toBe(SALT_ROUNDS);
    expect(await bcrypt.compare(dto.password, pending.password)).toBe(true);
    expect(result).toEqual({
      message: expect.any(String),
      email: dto.email,
      registrationId,
    });
  });

  it('register rejects an email that already has an account', async () => {
    users.findUnique.mockResolvedValue({ id: 1 });
    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(otp.createPending).not.toHaveBeenCalled();
  });

  it('verifyOtp with the right code creates the user and returns a JWT', async () => {
    const pending = { name: 'Ada', email: dto.email, password: 'bcrypt-hash' };
    otp.verify.mockResolvedValue(pending);
    users.create.mockResolvedValue({ id: 1, ...pending });
    const result = await service.verifyOtp({ registrationId, code: '123456' });
    expect(users.create).toHaveBeenCalledWith({ data: pending });
    expect(result.user).toEqual({ id: 1, name: 'Ada', email: dto.email });
    expect(jwt.verify(result.token)).toMatchObject({
      sub: '1',
      email: dto.email,
    });
  });

  it('verifyOtp with a wrong or expired code returns 400 and creates nothing', async () => {
    otp.verify.mockResolvedValue(null);
    await expect(
      service.verifyOtp({ registrationId, code: '000000' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(users.create).not.toHaveBeenCalled();
  });

  it('verifyOtp returns 409 if another signup for the email was verified first', async () => {
    otp.verify.mockResolvedValue({
      name: 'Ada',
      email: dto.email,
      password: 'bcrypt-hash',
    });
    users.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );
    await expect(
      service.verifyOtp({ registrationId, code: '123456' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('login returns a JWT for valid credentials', async () => {
    users.findUnique.mockResolvedValue({
      id: 1,
      name: 'Ada',
      email: dto.email,
      password: await bcrypt.hash(dto.password, 4),
    });
    const result = await service.login({
      email: dto.email,
      password: dto.password,
    });
    expect(jwt.verify(result.token)).toMatchObject({
      sub: '1',
      email: dto.email,
    });
  });

  it('login rejects a wrong password or unknown email with 401', async () => {
    users.findUnique.mockResolvedValue({
      id: 1,
      name: 'Ada',
      email: dto.email,
      password: await bcrypt.hash(dto.password, 4),
    });
    await expect(
      service.login({ email: dto.email, password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    users.findUnique.mockResolvedValue(null);
    await expect(
      service.login({ email: 'x@example.com', password: 'x' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  describe('validate', () => {
    const user = { id: 1, name: 'Ada', email: dto.email };

    it('is unauthenticated without a cookie', async () => {
      expect(await service.validate(undefined)).toEqual({
        authenticated: false,
      });
    });

    it('returns the user and expiry for a valid token', async () => {
      users.findUnique.mockResolvedValue(user);
      const token = await jwt.signAsync({ sub: '1', email: dto.email });
      const result = await service.validate(token);
      expect(result).toEqual({
        authenticated: true,
        user,
        expiresAt: expect.any(Date),
      });
      expect(users.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('rejects an expired token', async () => {
      const token = await jwt.signAsync(
        { sub: '1', email: dto.email },
        { expiresIn: '-1s' },
      );
      expect(await service.validate(token)).toEqual({ authenticated: false });
    });

    it('rejects a token signed with another secret', async () => {
      const forged = await new JwtService({ secret: 'attacker' }).signAsync({
        sub: '1',
        email: dto.email,
      });
      expect(await service.validate(forged)).toEqual({ authenticated: false });
      expect(users.findUnique).not.toHaveBeenCalled();
    });

    it('rejects an old token whose sub is a uuid', async () => {
      const token = await jwt.signAsync({
        sub: 'a8dc3462-522d-4d3c-8a08-95e86ae6c5b0',
        email: dto.email,
      });
      expect(await service.validate(token)).toEqual({ authenticated: false });
      expect(users.findUnique).not.toHaveBeenCalled();
    });

    it('rejects a valid token whose user was deleted', async () => {
      users.findUnique.mockResolvedValue(null);
      const token = await jwt.signAsync({ sub: '1', email: dto.email });
      expect(await service.validate(token)).toEqual({ authenticated: false });
    });
  });
});
