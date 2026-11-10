import { END, MemorySaver, START, StateGraph } from '@langchain/langgraph';
import { agentNode } from './nodes.js';
import { AgentState } from './state.js';

const workflow = new StateGraph(AgentState)
  .addNode('agent', agentNode)
  .addEdge(START, 'agent')
  .addEdge('agent', END);

// Keeps each thread's state in memory between requests (lost on restart)
const checkpointer = new MemorySaver();
export const graph = workflow.compile({ checkpointer });