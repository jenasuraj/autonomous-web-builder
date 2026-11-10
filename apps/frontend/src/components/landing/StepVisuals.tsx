import { ArrowUp } from 'lucide-react';

const terminal = [
  { text: '$ npm install', className: 'text-zinc-300' },
  { text: 'added 214 packages in 6s', className: 'text-zinc-500' },
  { text: '$ npm run dev', className: 'text-zinc-300' },
  { text: 'VITE ready in 412 ms', className: 'text-emerald-400' },
  { text: '➜ Local: localhost:5173', className: 'text-indigo-400' },
];

export function PromptVisual() {
  return (
    <div className="absolute inset-0 flex items-center p-5">
      <div className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 shadow-xl">
        <p className="flex h-10 items-start font-mono text-xs text-zinc-200">
          <span className="inline-block animate-typing overflow-hidden whitespace-nowrap">
            Build a habit tracker with streaks
          </span>
          <span className="ml-0.5 h-4 w-px animate-blink bg-indigo-400" />
        </p>
        <div className="flex justify-end">
          <span className="grid size-7 place-items-center rounded-full bg-white text-zinc-950">
            <ArrowUp className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function BuildVisual() {
  return (
    <div className="absolute inset-0 space-y-1.5 p-5 font-mono text-[11px]">
      {terminal.map(({ text, className }, i) => (
        <p
          key={text}
          className={`animate-reveal ${className}`}
          style={{ animationDelay: `${i * 0.6}s` }}
        >
          {text}
        </p>
      ))}
    </div>
  );
}

export function ShipVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-5">
      <div className="w-full animate-float rounded-xl border border-white/10 bg-zinc-900 p-4">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-16 rounded-full bg-white/30" />
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-400">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
              <span className="size-1.5 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>
        <div className="mt-4 animate-hue space-y-2">
          <div className="h-12 rounded-lg bg-linear-to-r from-indigo-500 to-fuchsia-500" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-6 rounded-md bg-indigo-500/30" />
            <div className="h-6 rounded-md bg-fuchsia-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
