export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// What POST /api/graph/invoke returns
export interface InvokeResponse {
  threadId: string;
  reply: string;
}

// One row of the sidebar, from GET /api/graph/threads
export interface ThreadSummary {
  threadId: string;
  title: string;
}

// GET /api/graph/threads/:threadId
export interface ThreadDetail extends ThreadSummary {
  history: ChatMessage[];
}
