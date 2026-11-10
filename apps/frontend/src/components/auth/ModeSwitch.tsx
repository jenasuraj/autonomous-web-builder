import type { AuthMode } from '../../types/auth';

const labels: Record<AuthMode, string> = {
  login: 'Log in',
  register: 'Register',
};

interface ModeSwitchProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
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
          onClick={() => onChange(tab)}
          className={`rounded-md py-2 font-medium transition ${mode === tab ? 'bg-white/10 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          {labels[tab]}
        </button>
      ))}
    </div>
  );
}
