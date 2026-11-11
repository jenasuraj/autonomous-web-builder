import { useSearchParams } from 'react-router';
import AuthCard from '../../components/auth/AuthCard';
import ModeSwitch from '../../components/auth/ModeSwitch';
import { useAppDispatch, useAppSelector } from '../../store';
import { cancelRegistration } from '../../store/auth/authSlice';
import type { AuthMode } from '../../types/auth';
import { APP_NAME } from '../../utils/helpers';
import LoginForm from './LoginForm';
import OtpForm from './OtpForm';
import RegisterForm from './RegisterForm';

const copy = {
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to keep building.',
    switchText: "Don't have an account?",
    switchLabel: 'Register',
  },
  register: {
    title: 'Create your account',
    subtitle: 'Start building apps from a prompt.',
    switchText: 'Already have an account?',
    switchLabel: 'Log in',
  },
};

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const pending = useAppSelector((s) => s.auth.pending);
  const [params, setParams] = useSearchParams();
  const mode: AuthMode =
    params.get('mode') === 'register' ? 'register' : 'login';
  const other: AuthMode = mode === 'login' ? 'register' : 'login';
  const verifying = mode === 'register' && pending;

  const switchMode = (next: AuthMode) => {
    dispatch(cancelRegistration());
    setParams(next === 'register' ? { mode: 'register' } : {});
  };

  const footer = !verifying && (
    <>
      {copy[mode].switchText}{' '}
      <button
        type="button"
        onClick={() => switchMode(other)}
        className="font-medium text-indigo-400 hover:text-indigo-300"
      >
        {copy[mode].switchLabel}
      </button>
    </>
  );

  return (
    <AuthCard footer={footer}>
      <title>{`${mode === 'login' ? 'Log in' : 'Register'} — ${APP_NAME}`}</title>
      {verifying ? (
        <OtpForm />
      ) : (
        <>
          <ModeSwitch mode={mode} onChange={switchMode} />
          <h1 className="text-2xl font-semibold tracking-tight">
            {copy[mode].title}
          </h1>
          <p className="mt-1 mb-6 text-sm text-zinc-400">
            {copy[mode].subtitle}
          </p>
          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </>
      )}
    </AuthCard>
  );
}
