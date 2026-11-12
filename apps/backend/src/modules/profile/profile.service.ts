import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { S3Service } from '../../infra/s3/s3.service.js';

export const AVATAR_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  // Public: GET /profile/:name. A user who never edited their profile gets profile: null
  async get(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({
      where,
      select: { name: true, profile: true },
    });
    if (!user) throw new NotFoundException('Profile not found');

    if (!user.profile)
      return { name: user.name, avatarUrl: null, profile: null };
    const { id: _id, userId: _userId, avatarKey, ...profile } = user.profile;
    return {
      name: user.name,
      avatarUrl: avatarKey ? await this.s3.signedUrl(avatarKey) : null,
      profile,
    };
  }

  async update(userId: number, dto: UpdateProfileDto) {
    await this.prisma.profile.upsert({
      where: { userId },
      create: Object.assign({ userId }, dto),
      update: dto,
    });
    return this.get({ id: userId });
  }

  // Key = avatars/<userId>/<uuid>.<ext>: unique, and you can tell whose it is from the key alone
  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const key = `avatars/${userId}/${randomUUID()}.${AVATAR_TYPES[file.mimetype]}`;

    // Upload first, so the db never points at an object that doesn't exist
    await this.s3.upload(key, file.buffer, file.mimetype);

    const old = await this.prisma.profile.findUnique({
      where: { userId },
      select: { avatarKey: true },
    });
    await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, avatarKey: key },
      update: { avatarKey: key },
    });

    // The old picture is no longer referenced; a failed delete only leaves a stray file
    if (old?.avatarKey) {
      await this.s3
        .delete(old.avatarKey)
        .catch((err: Error) =>
          this.logger.warn(`Could not delete ${old.avatarKey}: ${err.message}`),
        );
    }
    return this.get({ id: userId });
  }
}
