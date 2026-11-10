import { ArrowRight } from 'lucide-react';
import { buttonStyles } from '../ui/buttonStyles';

export default function Cta() {
  return (
    <section className="px-4 py-24">
      <div className="relative isolate mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 px-6 py-20 text-center">
        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-40 -z-10 mx-auto h-80 max-w-3xl rounded-full bg-linear-to-r from-indigo-600/40 via-fuchsia-500/30 to-orange-400/20 blur-3xl"
        />
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Your next idea is one prompt away
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-zinc-400">
          Stop setting up projects and start shipping them. Describe what you
          want and see it running in seconds.
        </p>
        <a href="#top" className={buttonStyles('primary', 'mt-8')}>
          Start building for free <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}
