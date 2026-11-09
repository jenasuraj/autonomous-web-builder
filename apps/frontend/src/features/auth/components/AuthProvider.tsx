import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router';
import type { User } from '../../../types';
import { AuthContext } from '../context/AuthContext';
import { logout, validateSession } from '../services/auth.service';
import type { AuthSession } from '../types/auth.types';

type AuthState =
  | { status: 'loading' | 'unauthenticated'; user: null; expiresAt: null }
  | { status: 'authenticated'; user: User; expiresAt: number };

const LOGGED_OUT: AuthState = {
  status: 'unauthenticated',
  user: null,
  expiresAt: null,
};
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

const toState = ({ user, expiresAt }: AuthSession): AuthState => ({
  status: 'authenticated',
  user,
  expiresAt: Date.parse(expiresAt),
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    user: null,
    expiresAt: null,
  });
  // Bumped on every check, login and logout, so a slow validate response can't overwrite a newer state
  const latest = useRef(0);

  const signIn = useCallback((session: AuthSession) => {
    latest.current++;
    setState(toState(session));
  }, []);

  const signOut = useCallback(async () => {
    latest.current++;
    try {
      await logout();
    } finally {
      setState(LOGGED_OUT);
    }
  }, []);

  useEffect(() => {
    const request = ++latest.current;
    validateSession()
      .then(
        (session) =>
          request === latest.current &&
          setState(session.authenticated ? toState(session) : LOGGED_OUT),
      )
      .catch(() => request === latest.current && setState(LOGGED_OUT));
  }, [pathname]);

  // Logs the user out in the browser the moment the token expires, without waiting for the next navigation
  useEffect(() => {
    if (!state.expiresAt) return;
    const timeout = setTimeout(
      () => setState(LOGGED_OUT),
      Math.min(state.expiresAt - Date.now(), MAX_TIMEOUT_MS),
    );
    return () => clearTimeout(timeout);
  }, [state.expiresAt]);

  const value = useMemo(
    () => ({ status: state.status, user: state.user, signIn, signOut }),
    [state.status, state.user, signIn, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
