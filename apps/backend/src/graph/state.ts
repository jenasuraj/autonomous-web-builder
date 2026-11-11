import type { BaseMessage } from '@langchain/core/messages';
import { Annotation, messagesStateReducer } from '@langchain/langgraph';

// Same idea as Python's `class State(TypedDict): messages: Annotated[list, add_messages]`
export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer, // appends new messages, replaces ones with the same id
    default: () => [],
  }),
});

export type AgentStateType = typeof AgentState.State;
