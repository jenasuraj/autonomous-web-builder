import { useState, type ChangeEvent, type FormEvent } from 'react';
import Button from '../../components/ui/Button';
import FormMessage from '../../components/ui/FormMessage';
import Input from '../../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser } from '../../store/auth/authThunks';
import type { LoginPayload } from '../../types/auth';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void dispatch(loginUser(form));
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
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging in…' : 'Log in'}
      </Button>
    </form>
  );
}
