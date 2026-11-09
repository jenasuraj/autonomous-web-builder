import { Sparkles } from 'lucide-react';
import ProductPreview from './ProductPreview';
import PromptBox from './PromptBox';

export default function Hero() {
  return (
    <section id="top" className="relative isolate px-4 pt-24 pb-16 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-48 -z-10 mx-auto h-[40rem] max-w-5xl rounded-full bg-linear-to-tr from-indigo-600/40 via-fuchsia-500/25 to-orange-400/20 blur-3xl"
      />
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          <Sparkles className="size-3.5 text-indigo-400" /> Full-stack apps from
          a single prompt
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          What will you{' '}
          <span className="bg-linear-to-r from-indigo-400 via-fuchsia-400 to-orange-300 bg-clip-text text-transparent">
            build
          </span>{' '}
          today?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-zinc-400">
          Describe your idea and an AI agent writes the code, installs packages
          and runs your app live in the browser.
        </p>
        <PromptBox />
      </div>
      <ProductPreview />
    </section>
  );
}
