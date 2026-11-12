import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { GraphController } from './graph.controller.js';
import { GraphService } from './graph.service.js';
import { ThreadService } from './thread.service.js';
import { ToolsService } from './tools.service.js';

@Module({
  imports: [AuthModule],
  controllers: [GraphController],
  providers: [GraphService, ThreadService, ToolsService],
})
export class GraphModule {}
