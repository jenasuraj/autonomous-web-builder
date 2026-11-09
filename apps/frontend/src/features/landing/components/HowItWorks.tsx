import SectionHeading from './SectionHeading';
import { BuildVisual, PromptVisual, ShipVisual } from './StepVisuals';

const steps = [
  {
    title: 'Describe your idea',
    text: 'Tell the agent what to build — a sentence is enough to get started.',
    Visual: PromptVisual,
  },
  {
    title: 'Watch it build',
    text: 'Files are written, packages installed and a live preview starts automatically.',
    Visual: BuildVisual,
  },
  {
    title: 'Refine and ship',
    text: 'Ask for changes, tweak the code yourself and export when it feels right.',
    Visual: ShipVisual,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-24">
      <SectionHeading
        eyebrow="How it works"
        title="From prompt to preview in three steps"
      />
      <ol className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
        {steps.map(({ title, text, Visual }, i) => (
          <li
            key={title}
            className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40"
          >
            <div className="relative aspect-[4/3] border-b border-white/5 bg-[radial-gradient(circle_at_50%_0%,rgb(99_102_241/0.15),transparent_70%)]">
              <Visual />
            </div>
            <div className="p-6">
              <span className="font-mono text-xs text-indigo-400">
                0{i + 1}
              </span>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
