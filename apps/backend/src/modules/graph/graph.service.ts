import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { HumanMessage } from '@langchain/core/messages';
import { END, MemorySaver, START, StateGraph } from '@langchain/langgraph';
import { AgentState } from '../../lib/agent/state.js';
import { agentNode } from '../../lib/agent/nodes.js';
import { ThreadService } from './thread.service.js';
import { ToolsService } from './tools.service.js';

@Injectable()
export class GraphService {
  private readonly graph;
  constructor(
    private readonly threads: ThreadService,
    tools: ToolsService,
  ) {
    this.graph = new StateGraph(AgentState)
      .addNode('agent', agentNode(tools.tools))
      .addEdge(START, 'agent')
      .addEdge('agent', END)
      .compile({ checkpointer: new MemorySaver() });
  }

  async invoke(userId: number, message: string, threadId: string) {

    const thread = await this.threads.get(userId, threadId);
    const config ={configurable: { thread_id: threadId },recursionLimit: 50};
    const { values } = await this.graph.getState(config); //checks the ram and check whether what this thead has  ...
    const past = values.messages?.length ? [] : this.threads.toMessages(thread);

    try {
      const state = await this.graph.invoke(
        { messages: [...past, new HumanMessage(message)] },
        config,
      );
      const reply = state.messages.at(-1)?.text ?? '';
      await this.threads.append(userId, threadId, [
        { role: 'user', content: message },
        { role: 'assistant', content: reply },
      ]);
      return { threadId, reply };
    } catch (err) {
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