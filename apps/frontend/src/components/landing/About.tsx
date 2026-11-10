import { Rocket, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { APP_NAME } from '../../utils/helpers';

const values = [
  {
    icon: Zap,
    title: 'Zero setup',
    text: 'No local installs or config — open a tab and start building.',
  },
  {
    icon: ShieldCheck,
    title: 'Your code, your rules',
    text: 'Everything the agent writes is plain code you can read, edit and export.',
  },
  {
    icon: Rocket,
    title: 'Built for momentum',
    text: 'Spend your time on ideas, not on boilerplate and tooling.',
  },
];

const rings = [
  { size: 'size-full', chips: ['React', 'Vue', 'Svelte', 'Node.js'] },
  { size: 'size-3/5', chips: ['Vite', 'Tailwind'] },
];

const positions = [
  'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
];

function OrbitVisual() {
  return (
    <div className="relative mx-auto grid aspect-square w-4/5 max-w-md place-items-center sm:w-full">
      <div className="absolute inset-[15%] rounded-full bg-indigo-600/20 blur-3xl" />
      {rings.map(({ size, chips }, r) => (
        <div
          key={size}
          className={`absolute ${size} rounded-full border border-white/10 ${r ? 'animate-orbit-reverse' : 'animate-orbit'}`}
        >
          {chips.map((chip, i) => (
            <span key={chip} className={`absolute ${positions[r ? i * 2 : i]}`}>
              <span
                className={`block rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs whitespace-nowrap text-zinc-300 shadow-lg ${r ? 'animate-orbit' : 'animate-orbit-reverse'}`}
              >
                {chip}
              </span>
            </span>
          ))}
        </div>
      ))}
      <div className="relative grid size-20 place-items-center rounded-2xl border border-white/10 bg-linear-to-br from-indigo-500 to-fuchsia-500 shadow-2xl shadow-indigo-500/30">
        <Sparkles className="size-8 text-white" />
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="px-4 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <OrbitVisual />
        <div>
          <p className="text-sm font-medium text-indigo-400">About</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            We believe anyone with an idea should be able to build it
          </h2>
          <p className="mt-4 text-pretty text-zinc-400">
            {APP_NAME} pairs an AI coding agent with a full development
            environment that runs right in your browser. Whether you are a
            seasoned engineer or writing your first line of code, you go from
            idea to working app without fighting your tools.
          </p>
          <ul className="mt-8 space-y-5">
            {values.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-indigo-400" />
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
