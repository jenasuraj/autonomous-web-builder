import { useState, type ChangeEvent, type FormEvent } from 'react';
import Button from '../../components/ui/Button';
import FormMessage from '../../components/ui/FormMessage';
import Input from '../../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerUser } from '../../store/auth/authThunks';
import type { RegisterPayload } from '../../types/auth';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void dispatch(registerUser(form));
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
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
