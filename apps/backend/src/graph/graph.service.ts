import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { HumanMessage } from '@langchain/core/messages';
import { graph } from './graph.js';
import { ThreadService } from './thread.service.js';

@Injectable()
export class GraphService {
  constructor(private readonly threads: ThreadService) {}

  // graph.invoke(input, config): input is a partial state, config picks the thread
  async invoke(userId: number, message: string, threadId: string) {
    await this.threads.get(userId, threadId); // 404 unless this user owns the thread

    try {
      const state = await graph.invoke(
        { messages: [new HumanMessage(message)] },
        { configurable: { thread_id: threadId }, recursionLimit: 50 },
      );
      const reply = state.messages.at(-1)?.text ?? '';

      await this.threads.append(userId, threadId, [
        { role: 'user', content: message },
        { role: 'assistant', content: reply },
      ]);
      return { threadId, reply };
    } catch (err) {
      // Gemini answers 429/503 when it is rate limited or overloaded; tell the user to retry
      const status = (err as { status?: number }).status;
      if (status === 429 || status === 503) {
        throw new ServiceUnavailableException(
          'The AI model is busy right now. Please try again in a moment.',
        );
      }
      throw err;
    }
  }
}
