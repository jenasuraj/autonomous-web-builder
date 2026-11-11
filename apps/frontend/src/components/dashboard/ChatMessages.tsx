import type { ChatMessage } from '../../types/dashboard';

interface ChatMessagesProps {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatMessages({ messages, loading }: ChatMessagesProps) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
            m.role === 'user' ? 'ml-auto bg-indigo-500' : 'bg-zinc-800'
          }`}
        >
          {m.content}
        </div>
      ))}
      {loading && <p className="text-sm text-zinc-500">Thinking…</p>}
    </div>
  );
}
