import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, SquarePen } from 'lucide-react';
import type { ThreadSummary } from '../../types/dashboard';

interface SidebarProps {
  threads: ThreadSummary[];
  activeId: string | null;
  onNewChat: () => void;
  onOpen: (threadId: string) => void;
}

export default function Sidebar({
  threads,
  activeId,
  onNewChat,
  onOpen,
}: SidebarProps) {
  const [open, setOpen] = useState(true);
  const Toggle = open ? PanelLeftClose : PanelLeftOpen;

  return (
    <aside
      className={`flex min-h-0 shrink-0 flex-col gap-2 rounded-xl border border-white/10 p-2 ${
        open ? 'w-60' : 'w-12'
      }`}
    >
      <div className="flex items-center gap-1">
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <Toggle size={18} />
        </button>
        {open && (
          <button
            onClick={onNewChat}
            className="flex flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5"
          >
            <SquarePen size={16} /> New chat
          </button>
        )}
      </div>

      {open && (
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {threads.map((t) => (
            <button
              key={t.threadId}
              onClick={() => onOpen(t.threadId)}
              className={`block w-full truncate rounded-lg px-2 py-1.5 text-left text-sm ${
                t.threadId === activeId
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              {t.title}
            </button>
          ))}
        </nav>
      )}
    </aside>
  );
}
