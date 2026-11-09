import {
  DashboardMock,
  FinanceMock,
  LandingMock,
  PortfolioMock,
} from './AppMockups';
import MockWindow from './MockWindow';
import SectionHeading from './SectionHeading';

const projects = [
  {
    title: 'SaaS analytics dashboard',
    prompt: 'A dashboard with revenue charts and KPIs',
    stack: 'React · Recharts',
    url: 'acme-analytics',
    Mock: DashboardMock,
  },
  {
    title: 'Agency website',
    prompt: 'A bold landing page for a design agency',
    stack: 'Astro · Tailwind',
    url: 'studio-north',
    Mock: LandingMock,
  },
  {
    title: 'Personal finance app',
    prompt: 'A mobile-first budget tracker with insights',
    stack: 'Vue · Pinia',
    url: 'pocket-budget',
    Mock: FinanceMock,
  },
  {
    title: 'Creative portfolio',
    prompt: 'A colorful portfolio for my design work',
    stack: 'Next.js · Motion',
    url: 'my-portfolio',
    Mock: PortfolioMock,
  },
];

export default function Showcase() {
  return (
    <section id="showcase" className="px-4 py-24">
      <SectionHeading
        eyebrow="Showcase"
        title="Built with a single prompt"
        description="A few examples of what people create in their first session."
      />
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2">
        {projects.map(({ title, prompt, stack, url, Mock }) => (
          <article
            key={title}
            className="group rounded-2xl border border-white/10 bg-zinc-900/40 p-2 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:shadow-2xl hover:shadow-indigo-950/40"
          >
            <MockWindow url={`${url}.app`} className="aspect-video">
              <Mock />
            </MockWindow>
            <div className="flex items-start justify-between gap-4 p-4">
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-zinc-400">“{prompt}”</p>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-400">
                {stack}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
