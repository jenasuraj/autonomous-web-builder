const stacks = [
  'React',
  'Next.js',
  'Vue',
  'Svelte',
  'Angular',
  'Astro',
  'Node.js',
  'Express',
  'Tailwind CSS',
  'Vite',
];

export default function StackStrip() {
  return (
    <section className="py-12">
      <p className="px-4 text-center text-sm text-zinc-500">
        Works with the frameworks you already use
      </p>
      <div className="mx-auto mt-6 max-w-5xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 gap-12 pr-12"
            >
              {stacks.map((stack) => (
                <li
                  key={stack}
                  className="text-lg font-semibold tracking-tight text-zinc-500 transition hover:text-zinc-200"
                >
                  {stack}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
