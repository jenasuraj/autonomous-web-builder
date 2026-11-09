export type ButtonVariant = 'primary' | 'secondary';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-white text-zinc-950 hover:bg-zinc-200',
  secondary:
    'border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10',
};

export const buttonStyles = (
  variant: ButtonVariant = 'primary',
  className = '',
) =>
  `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${className}`;
