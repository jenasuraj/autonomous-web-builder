import { useState, type ChangeEvent, type FormEvent } from 'react';
import Button from '../../components/ui/Button';
import FormMessage from '../../components/ui/FormMessage';
import Input from '../../components/ui/Input';
import { getErrorMessage } from '../../utils/helpers';
import { login } from './auth.service';
import type { AuthSession, LoginPayload } from '../../types/auth';

export default function LoginForm({
  onSuccess,
}: {
  onSuccess: (session: AuthSession) => void;
}) {
  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      onSuccess(await login(form));
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={handleChange}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={form.password}
        onChange={handleChange}
      />
      <FormMessage message={error} />
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Logging in…' : 'Log in'}
      </Button>
    </form>
  );
}
