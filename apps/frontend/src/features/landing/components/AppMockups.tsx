const bars = [45, 70, 55, 85, 60, 95, 75, 88, 58, 92, 78, 100];

const stats = [
  { label: 'Revenue', value: '$48.2k', trend: '+12.5%' },
  { label: 'Users', value: '2,184', trend: '+8.1%' },
  { label: 'Churn', value: '1.9%', trend: '-0.4%' },
];

const transactions = [
  { name: 'Spotify', amount: '-$9.99', color: 'bg-emerald-400' },
  { name: 'Salary', amount: '+$4,200', color: 'bg-indigo-400' },
  { name: 'Groceries', amount: '-$62.40', color: 'bg-amber-400' },
];

const tiles = [
  'from-indigo-500 to-fuchsia-500 row-span-2',
  'from-orange-400 to-rose-500',
  'from-emerald-400 to-cyan-500',
  'from-sky-400 to-indigo-500 row-span-2',
  'from-fuchsia-500 to-orange-400',
  'from-zinc-600 to-zinc-800',
];

const skeleton = 'rounded-full bg-white/10';

export function DashboardMock() {
  return (
    <div className="absolute inset-0 flex gap-3 p-3 sm:p-4">
      <div className="hidden w-1/6 shrink-0 space-y-2.5 sm:block">
        <div className="mb-4 h-3 w-3/4 rounded-full bg-indigo-400/60" />
        {[80, 60, 70, 50, 65].map((w, i) => (
          <div
            key={i}
            className={`h-2 ${skeleton} ${i === 1 ? 'bg-white/25' : ''}`}
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map(({ label, value, trend }) => (
            <div
              key={label}
              className="rounded-lg border border-white/5 bg-white/[0.03] p-2 sm:p-3"
            >
              <p className="text-[9px] text-zinc-500 sm:text-[10px]">{label}</p>
              <p className="mt-0.5 text-xs font-semibold sm:text-base">
                {value}
              </p>
              <p
                className={`text-[9px] sm:text-[10px] ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {trend}
              </p>
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-5 gap-2 sm:gap-3">
          <div className="col-span-3 flex items-end gap-1 rounded-lg border border-white/5 bg-white/[0.03] p-2 sm:gap-1.5 sm:p-3">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 origin-bottom animate-grow rounded-t-sm bg-linear-to-t from-indigo-500/40 to-indigo-400"
                style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
          <div className="col-span-2 rounded-lg border border-white/5 bg-white/[0.03] p-2 sm:p-3">
            <svg
              viewBox="0 0 100 60"
              className="size-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 50 C15 45 20 20 35 28 S55 50 65 30 S85 8 100 12"
                pathLength={1}
                strokeDasharray={1}
                className="animate-draw fill-none stroke-fuchsia-400"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingMock() {
  return (
    <div className="absolute inset-0 overflow-hidden p-4">
      <div className="absolute -top-6 -right-6 size-28 animate-float rounded-full bg-linear-to-br from-fuchsia-500/60 to-orange-400/50 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div className="h-2.5 w-14 rounded-full bg-white/40" />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1.5 w-8 ${skeleton}`} />
          ))}
        </div>
      </div>
      <div className="relative mt-8 space-y-2.5">
        <div className="h-4 w-3/4 animate-shimmer rounded-full bg-linear-to-r from-white/70 via-white/20 to-white/70 bg-[length:200%_100%]" />
        <div className="h-4 w-1/2 animate-shimmer rounded-full bg-linear-to-r from-white/70 via-white/20 to-white/70 bg-[length:200%_100%]" />
        <div className={`h-2 w-2/3 ${skeleton}`} />
        <div className="h-5 w-20 rounded-full bg-orange-400/90" />
      </div>
      <div className="relative mt-6 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-12 animate-reveal rounded-lg border border-white/5 bg-white/[0.04]"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function FinanceMock() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-indigo-500/10 to-emerald-500/10 py-3">
      <div className="flex h-full w-36 animate-float flex-col rounded-[1.25rem] border border-white/15 bg-zinc-950 p-3 shadow-2xl">
        <p className="text-[9px] text-zinc-500">Total balance</p>
        <p className="text-sm font-semibold">$12,480</p>
        <div className="relative mx-auto my-2 size-16">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15"
              className="fill-none stroke-white/10"
              strokeWidth={4}
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              pathLength={1}
              strokeDasharray={1}
              className="animate-draw fill-none stroke-emerald-400"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[9px] font-medium">
            72%
          </span>
        </div>
        <div className="space-y-1.5">
          {transactions.map(({ name, amount, color }, i) => (
            <div
              key={name}
              className="flex animate-reveal items-center gap-1.5 text-[9px]"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <span className={`size-3 rounded-full ${color}`} />
              <span className="flex-1 text-zinc-400">{name}</span>
              <span>{amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PortfolioMock() {
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-3">
      {tiles.map((tile, i) => (
        <div
          key={tile}
          className={`animate-float rounded-lg bg-linear-to-br opacity-80 ${tile}`}
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </div>
  );
}
