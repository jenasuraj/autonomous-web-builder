import { useState, type ChangeEvent, type FormEvent } from 'react';
import Button from '../../../components/ui/Button';
import FormMessage from '../../../components/ui/FormMessage';
import Input from '../../../components/ui/Input';
import { getErrorMessage } from '../../../utils/helpers';
import { register } from '../services/auth.service';
import type { RegisterPayload, RegisterResponse } from '../types/auth.types';

export default function RegisterForm({
  onRegistered,
}: {
  onRegistered: (pending: RegisterResponse) => void;
}) {
  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      onRegistered(await register(form));
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        autoComplete="name"
        required
        maxLength={100}
        value={form.name}
        onChange={handleChange}
      />
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
        autoComplete="new-password"
        placeholder="At least 8 characters"
        required
        minLength={8}
        maxLength={72}
        value={form.password}
        onChange={handleChange}
      />
      <FormMessage message={error} />
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
