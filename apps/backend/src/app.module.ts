import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './infra/mail/mail.module.js';
import { PrismaModule } from './infra/prisma/prisma.module.js';
import { RedisModule } from './infra/redis/redis.module.js';
import { S3Module } from './infra/s3/s3.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { GraphModule } from './modules/graph/graph.module.js';
import { ProfileModule } from './modules/profile/profile.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // infra: connections, no routes
    PrismaModule,
    RedisModule,
    MailModule,
    S3Module,
    // features: /api/auth, /api/graph, /api/profile
    AuthModule,
    GraphModule,
    ProfileModule,
  ],
})
export class AppModule {}
