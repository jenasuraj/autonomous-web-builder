import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ProfileController } from './profile.controller.js';
import { ProfileService } from './profile.service.js';
import { S3Service } from './s3.service.js';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, S3Service],
})
export class ProfileModule {}
