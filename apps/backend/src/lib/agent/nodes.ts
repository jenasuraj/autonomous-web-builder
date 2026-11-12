import type { StructuredToolInterface } from '@langchain/core/tools';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { getLLM } from './llm.js';
import { AGENT_PROMPT } from './prompts.js';
import type { AgentStateType } from './state.js';

export const agentNode =
  (tools: StructuredToolInterface[]) => async (state: AgentStateType) => {
    const agent = createReactAgent({
      llm: getLLM(),
      tools,
      prompt: AGENT_PROMPT,
    });
    const result = await agent.invoke({ messages: state.messages });
    return { messages: result.messages };
  };
