import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(config: ConfigService) {
    super(config.getOrThrow<string>('REDIS_URL'));
    this.on('error', (error) =>
      this.logger.error(`Redis error: ${error.message}`),
    );
  }

  async onModuleDestroy() {
    await this.quit();
  }
}