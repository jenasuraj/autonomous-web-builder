import { CircleCheck } from 'lucide-react';
import { DashboardMock } from './AppMockups';
import MockWindow from './MockWindow';

const steps = [
  'Created src/App.tsx',
  'Created src/components/Chart.tsx',
  'npm install recharts',
  'npm run dev',
];

export default function ProductPreview() {
  return (
    <div className="mx-auto mt-20 max-w-5xl rounded-2xl border border-white/10 bg-zinc-900/60 p-2 shadow-2xl shadow-black/50 backdrop-blur">
      <MockWindow url="localhost:5173 — analytics-dashboard">
        <div className="grid md:grid-cols-[17rem_1fr]">
          <aside className="hidden flex-col gap-4 border-r border-white/5 p-4 text-left text-sm md:flex">
            <p className="self-end rounded-xl rounded-br-sm bg-indigo-500/15 px-3 py-2 text-zinc-200">
              Build an analytics dashboard with revenue charts
            </p>
            <div className="space-y-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              {steps.map((step, i) => (
                <div
                  key={step}
                  className="flex animate-reveal items-center gap-2 font-mono text-xs text-zinc-400"
                  style={{ animationDelay: `${i * 0.7}s` }}
                >
                  <CircleCheck className="size-3.5 shrink-0 text-emerald-400" />
                  <span className="truncate">{step}</span>
                </div>
              ))}
            </div>
          </aside>
          <div className="relative aspect-[16/10]">
            <DashboardMock />
          </div>
        </div>
      </MockWindow>
    </div>
  );
}
