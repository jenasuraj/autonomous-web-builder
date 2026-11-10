import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { getLLM } from './llm.js';
import { AGENT_PROMPT } from './prompts.js';
import type { AgentStateType } from './state.js';
import { tools } from './tools.js';

// A node takes the whole state and returns only the keys it updates, like in Python
export async function agentNode(state: AgentStateType) {
  const agent = createReactAgent({
    llm: getLLM(),
    tools,
    prompt: AGENT_PROMPT,
  });
  const result = await agent.invoke({ messages: state.messages });
  return { messages: result.messages };
}