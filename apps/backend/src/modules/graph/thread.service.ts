import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infra/prisma/prisma.service.js';

export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Every query filters by userId, so a user can only ever touch their own threads
@Injectable()
export class ThreadService {
  constructor(private readonly prisma: PrismaService) {}

  // Sidebar list, newest first. Unused new chats (title null) are hidden
  list(userId: number) {
    return this.prisma.thread.findMany({
      where: { userId, title: { not: null } },
      orderBy: { updatedAt: 'desc' },
      select: { threadId: true, title: true },
    });
  }

  // Reuse the user's unused new chat if there is one, so refreshes don't pile up empty rows
  async create(userId: number) {
    const unused = await this.prisma.thread.findFirst({
      where: { userId, title: null },
      select: { threadId: true },
    });
    if (unused) return unused;

    return this.prisma.thread.create({
      data: { threadId: `${userId}-${randomUUID()}`, userId },
      select: { threadId: true },
    });
  }

  async get(userId: number, threadId: string) {
    const thread = await this.prisma.thread.findFirst({
      where: { userId, threadId },
      select: { threadId: true, title: true, history: true },
    });
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  async delete(userId: number, threadId: string) {
    const { count } = await this.prisma.thread.deleteMany({
      where: { userId, threadId },
    });
    if (!count) throw new NotFoundException('Thread not found');
  }

  // Appends to the jsonb array in one query; the first message also becomes the title
  async append(userId: number, threadId: string, messages: HistoryMessage[]) {
    const title = messages[0].content.slice(0, 40);
    await this.prisma.$executeRaw`
      UPDATE "threads"
      SET "history" = "history" || ${JSON.stringify(messages)}::jsonb,
          "title" = COALESCE("title", ${title}),
          "updatedAt" = now()
      WHERE "threadId" = ${threadId} AND "userId" = ${userId}`;
  }
}
