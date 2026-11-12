import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { AuthGuard, type AuthUser } from '../auth/auth.guard.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { AVATAR_TYPES, ProfileService } from './profile.service.js';

type AuthRequest = Request & { user: AuthUser };

@Controller('profile')
export class ProfileController {
  constructor(private readonly profiles: ProfileService) {}

  // Public, anyone can view: /api/profile/suraj
  @Get(':name')
  get(@Param('name') name: string) {
    return this.profiles.get({ name });
  }

  // Your own profile only; the user comes from the cookie, never from the body
  @Patch()
  @UseGuards(AuthGuard)
  update(@Req() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    return this.profiles.update(req.user.id, dto);
  }

  // multipart/form-data with the file in the "image" field; max 5 MB, images only
  @Post('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) =>
        file.mimetype in AVATAR_TYPES
          ? cb(null, true)
          : cb(
              new BadRequestException(
                'Only images are allowed (jpeg, png, gif, webp)',
              ),
              false,
            ),
    }),
  )
  uploadAvatar(
    @Req() req: AuthRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('Send the image in the "image" field');
    return this.profiles.uploadAvatar(req.user.id, file);
  }
}
