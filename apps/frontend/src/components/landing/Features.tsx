import {
  Bug,
  Code,
  Download,
  Globe,
  Layers,
  MessageSquare,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

const features = [
  {
    icon: MessageSquare,
    title: 'Prompt to app',
    text: 'Describe what you want in plain English and get a working project in seconds.',
  },
  {
    icon: Globe,
    title: 'Runs in your browser',
    text: 'Every project runs in a full Node.js environment inside your tab. No installs, no servers.',
  },
  {
    icon: Code,
    title: 'Real, editable code',
    text: 'Open any file, change it by hand or ask the agent to. You always own the code.',
  },
  {
    icon: Bug,
    title: 'Fixes its own errors',
    text: 'Build failed? The agent reads the terminal output and patches the code for you.',
  },
  {
    icon: Layers,
    title: 'Any JavaScript stack',
    text: 'React, Vue, Svelte, Angular or a plain Node server — pick the tools you like.',
  },
  {
    icon: Download,
    title: 'Export anytime',
    text: 'Download the full project and keep building in your own editor whenever you want.',
  },
];

export default function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need to go from idea to app"
        description="A coding agent, an editor and a live preview — all in one tab."
      />
      <div className="mx-auto mt-16 grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="bg-zinc-950 p-8 transition hover:bg-zinc-900/60"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Icon className="size-5 text-indigo-400" />
            </span>
            <h3 className="mt-5 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
