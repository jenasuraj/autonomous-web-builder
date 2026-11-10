import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { APP_NAME } from '../../utils/helpers';

interface AuthCardProps {
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({ children, footer }: AuthCardProps) {
  return (
    <section className="relative isolate flex min-h-screen items-center justify-center px-4 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-96 max-w-3xl rounded-full bg-linear-to-tr from-indigo-600/30 via-fuchsia-500/20 to-orange-400/10 blur-3xl"
      />
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 font-semibold"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-indigo-500 to-fuchsia-500">
            <Sparkles className="size-4" />
          </span>
          {APP_NAME}
        </Link>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
          {children}
        </div>
        {footer && (
          <div className="mt-6 text-center text-sm text-zinc-500">{footer}</div>
        )}
      </div>
    </section>
  );
}
