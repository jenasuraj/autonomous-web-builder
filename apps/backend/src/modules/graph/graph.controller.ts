import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard, type AuthUser } from '../auth/auth.guard.js';
import { InvokeGraphDto } from './dto/invoke-graph.dto.js';
import { GraphService } from './graph.service.js';
import { ThreadService } from './thread.service.js';

type AuthRequest = Request & { user: AuthUser };

@Controller('graph')
@UseGuards(AuthGuard)
export class GraphController {
  constructor(
    private readonly graph: GraphService,
    private readonly threads: ThreadService,
  ) {}

  @Post('invoke')
  @HttpCode(200)
  invoke(
    @Req() req: AuthRequest,
    @Body() { message, threadId }: InvokeGraphDto,
  ) {
    return this.graph.invoke(req.user.id, message, threadId);
  }

  // Sidebar: [{ threadId, title }]
  @Get('threads')
  listThreads(@Req() req: AuthRequest) {
    return this.threads.list(req.user.id);
  }

  // Dashboard load and "New chat": { threadId }
  @Post('threads')
  createThread(@Req() req: AuthRequest) {
    return this.threads.create(req.user.id);
  }

  // Opening an old chat: { threadId, title, history }
  @Get('threads/:threadId')
  getThread(@Req() req: AuthRequest, @Param('threadId') threadId: string) {
    return this.threads.get(req.user.id, threadId);
  }

  @Delete('threads/:threadId')
  @HttpCode(204)
  deleteThread(@Req() req: AuthRequest, @Param('threadId') threadId: string) {
    return this.threads.delete(req.user.id, threadId);
  }
}
