import { MailCheck } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import OtpInput from '../../components/auth/OtpInput';
import Button from '../../components/ui/Button';
import FormMessage from '../../components/ui/FormMessage';
import { getErrorMessage } from '../../utils/helpers';
import { resendOtp, verifyOtp } from './auth.service';
import type { AuthSession, RegisterResponse } from '../../types/auth';

const RESEND_SECONDS = 60;

interface OtpFormProps {
  pending: RegisterResponse;
  onVerified: (session: AuthSession) => void;
  onBack: () => void;
}

export default function OtpForm({ pending, onVerified, onBack }: OtpFormProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timeout = setTimeout(
      () => setCooldown((seconds) => seconds - 1),
      1000,
    );
    return () => clearTimeout(timeout);
  }, [cooldown]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      onVerified(
        await verifyOtp({ registrationId: pending.registrationId, code }),
      );
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setNotice('');
    try {
      await resendOtp(pending.registrationId);
      setNotice('A new code is on its way.');
      setCode('');
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-indigo-500/15">
        <MailCheck className="size-6 text-indigo-400" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-zinc-200">{pending.email}</span>
        </p>
      </div>
      <OtpInput value={code} onChange={setCode} />
      <FormMessage message={error} />
      <FormMessage message={notice} tone="success" />
      <Button
        type="submit"
        disabled={submitting || code.length !== 6}
        className="w-full"
      >
        {submitting ? 'Verifying…' : 'Verify email'}
      </Button>
      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-zinc-400 transition hover:text-zinc-100"
        >
          Use a different email
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-indigo-400 transition hover:text-indigo-300 disabled:text-zinc-600"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </div>
    </form>
  );
}
