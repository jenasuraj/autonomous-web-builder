import { useState, type FormEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-white/10 p-3"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask the agent…"
        aria-label="Message"
        className="flex-1 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-400"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="rounded-lg bg-indigo-500 px-4 text-sm font-medium disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}
