import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { APP_NAME } from '../../../utils/helpers';
import LoginForm from '../components/LoginForm';
import OtpForm from '../components/OtpForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import type { RegisterResponse } from '../types/auth.types';

type Mode = 'login' | 'register';

const copy = {
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to keep building.',
    switchText: "Don't have an account?",
    switchLabel: 'Register',
  },
  register: {
    title: 'Create your account',
    subtitle: 'Start building apps from a prompt.',
    switchText: 'Already have an account?',
    switchLabel: 'Log in',
  },
};

export default function AuthPage() {
  const { signIn } = useAuth();
  const [params, setParams] = useSearchParams();
  const [pending, setPending] = useState<RegisterResponse | null>(null);
  const mode: Mode = params.get('mode') === 'register' ? 'register' : 'login';
  const other: Mode = mode === 'login' ? 'register' : 'login';
  const verifying = mode === 'register' && pending;

  const switchMode = (next: Mode) => {
    setPending(null);
    setParams(next === 'register' ? { mode: 'register' } : {});
  };

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center px-4 py-24">
      <title>{`${mode === 'login' ? 'Log in' : 'Register'} — ${APP_NAME}`}</title>
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
          {verifying ? (
            <OtpForm
              pending={pending}
              onVerified={signIn}
              onBack={() => setPending(null)}
            />
          ) : (
            <>
              <div
                className="mb-6 grid grid-cols-2 rounded-lg bg-zinc-950/60 p-1 text-sm"
                role="group"
                aria-label="Choose login or register"
              >
                {(['login', 'register'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    aria-pressed={mode === tab}
                    onClick={() => switchMode(tab)}
                    className={`rounded-md py-2 font-medium transition ${mode === tab ? 'bg-white/10 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {tab === 'login' ? 'Log in' : 'Register'}
                  </button>
                ))}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {copy[mode].title}
              </h1>
              <p className="mt-1 mb-6 text-sm text-zinc-400">
                {copy[mode].subtitle}
              </p>
              {mode === 'login' ? (
                <LoginForm onSuccess={signIn} />
              ) : (
                <RegisterForm onRegistered={setPending} />
              )}
            </>
          )}
        </div>
        {!verifying && (
          <p className="mt-6 text-center text-sm text-zinc-500">
            {copy[mode].switchText}{' '}
            <button
              type="button"
              onClick={() => switchMode(other)}
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              {copy[mode].switchLabel}
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
