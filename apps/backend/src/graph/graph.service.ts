import { Injectable, NotFoundException } from '@nestjs/common';
import { HumanMessage, type BaseMessage } from '@langchain/core/messages';
import { randomUUID } from 'node:crypto';
import { graph } from './graph.js';

const toJson = (message: BaseMessage) => ({
  role: message.getType(), // 'human' | 'ai' | 'tool' | 'system'
  content: message.text,
  ...('tool_calls' in message &&
  Array.isArray(message.tool_calls) &&
  message.tool_calls.length
    ? {
        toolCalls: message.tool_calls.map(({ name, args }) => ({ name, args })),
      }
    : {}),
});

@Injectable()
export class GraphService {
  // graph.invoke(input, config): input is a partial state, config picks the thread
  async invoke(message: string, threadId: string = randomUUID()) {
    const state = await graph.invoke(
      { messages: [new HumanMessage(message)] },
      { configurable: { thread_id: threadId }, recursionLimit: 50 },
    );
    return {
      threadId,
      reply: state.messages.at(-1)?.text ?? '',
      messages: state.messages.map(toJson),
    };
  }

  // graph.getState(config): the saved state of one thread
  async getState(threadId: string) {
    const snapshot = await graph.getState({
      configurable: { thread_id: threadId },
    });
    const messages = (snapshot.values as { messages?: BaseMessage[] }).messages;
    if (!messages?.length) throw new NotFoundException('Thread not found');
    return { threadId, messages: messages.map(toJson) };
  }
}
