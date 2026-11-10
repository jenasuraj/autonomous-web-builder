import type { ReactNode } from 'react';

interface MockWindowProps {
  url?: string;
  className?: string;
  children: ReactNode;
}

export default function MockWindow({
  url = 'localhost:5173',
  className = '',
  children,
}: MockWindowProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="size-2 rounded-full bg-zinc-700" />
        <span className="size-2 rounded-full bg-zinc-700" />
        <span className="size-2 rounded-full bg-zinc-700" />
        <span className="mx-auto rounded bg-white/5 px-6 py-0.5 font-mono text-[10px] text-zinc-500">
          {url}
        </span>
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}
