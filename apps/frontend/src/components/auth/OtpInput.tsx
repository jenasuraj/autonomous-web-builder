interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OtpInput({ value, onChange }: OtpInputProps) {
  return (
    <input
      aria-label="Verification code"
      inputMode="numeric"
      autoComplete="one-time-code"
      autoFocus
      maxLength={6}
      placeholder="000000"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
      className="w-full rounded-lg border border-white/10 bg-zinc-950/60 py-3 text-center font-mono text-2xl tracking-[0.5em] text-zinc-100 placeholder:text-zinc-700 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 focus:outline-none"
    />
  );
}
