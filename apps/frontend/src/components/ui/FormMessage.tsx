interface FormMessageProps {
  message: string;
  tone?: 'error' | 'success';
}

const tones = {
  error: 'border-rose-400/20 bg-rose-400/10 text-rose-300',
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
};

export default function FormMessage({
  message,
  tone = 'error',
}: FormMessageProps) {
  if (!message) return null;
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-3 py-2 text-sm ${tones[tone]}`}
    >
      {message}
    </p>
  );
}
