import { ArrowUp, Paperclip } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent } from 'react';
import Button from '../../../components/ui/Button';

const suggestions = [
  'SaaS landing page',
  'Todo app with auth',
  'Personal portfolio',
  'Admin dashboard',
];

export default function PromptBox() {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();

  // Enter submits, Shift+Enter adds a new line
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-zinc-900/80 p-3 text-left shadow-2xl shadow-indigo-950/50 backdrop-blur transition focus-within:border-indigo-400/50"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          aria-label="Describe the app you want to build"
          placeholder="Describe the app you want to build..."
          className="w-full resize-none bg-transparent px-2 py-1 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        />
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Attach a file"
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
          >
            <Paperclip className="size-4" />
          </button>
          <Button
            type="submit"
            disabled={!prompt.trim()}
            className="px-3!"
            aria-label="Start building"
          >
            Build <ArrowUp className="size-4" />
          </Button>
        </div>
      </form>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setPrompt(`Build a ${suggestion.toLowerCase()}`)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-white/20 hover:text-zinc-100"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
