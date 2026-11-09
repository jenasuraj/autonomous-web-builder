import { Star } from 'lucide-react';
import { APP_NAME, getInitials } from '../../../utils/helpers';
import SectionHeading from './SectionHeading';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Indie hacker',
    color: 'from-indigo-500 to-fuchsia-500',
    quote: `I shipped the MVP for my side project over a weekend. ${APP_NAME} handled the boilerplate so I could focus on the product.`,
  },
  {
    name: 'Daniel Okafor',
    role: 'Frontend engineer',
    color: 'from-emerald-400 to-cyan-500',
    quote:
      'The code it writes is actually readable. I export projects and keep working on them in my own editor.',
  },
  {
    name: 'Lena Fischer',
    role: 'Product designer',
    color: 'from-orange-400 to-rose-500',
    quote:
      'I can turn a design idea into a clickable prototype without waiting on anyone. It changed how I present work.',
  },
  {
    name: 'Marcus Lee',
    role: 'Startup founder',
    color: 'from-sky-400 to-indigo-500',
    quote:
      'We test three landing page ideas a week now. Going from prompt to live preview takes minutes, not days.',
  },
  {
    name: 'Sofia Martínez',
    role: 'CS student',
    color: 'from-fuchsia-500 to-orange-400',
    quote:
      'Watching the agent explain and fix its own errors taught me more about debugging than any tutorial.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Freelance developer',
    color: 'from-amber-400 to-emerald-400',
    quote:
      'Client asks for a quick demo? I describe it, tweak a few files and send a link the same afternoon.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-4 py-24">
      <SectionHeading
        eyebrow="Testimonials"
        title="Loved by builders everywhere"
      />
      <div className="mx-auto mt-16 max-w-6xl columns-1 gap-6 md:columns-2 lg:columns-3">
        {testimonials.map(({ name, role, color, quote }) => (
          <figure
            key={name}
            className="mb-6 break-inside-avoid rounded-2xl border border-white/10 bg-zinc-900/40 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <div
              className="flex gap-0.5 text-amber-400"
              aria-label="5 out of 5 stars"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed text-zinc-300">
              “{quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span
                aria-hidden
                className={`grid size-10 place-items-center rounded-full bg-linear-to-br text-sm font-semibold text-white ${color}`}
              >
                {getInitials(name)}
              </span>
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-zinc-500">{role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
