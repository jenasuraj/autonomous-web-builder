import { useId, type ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  label: string;
}

export default function Input({
  label,
  id,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="text-left">
      <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        id={inputId}
        className={`mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 transition placeholder:text-zinc-600 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
