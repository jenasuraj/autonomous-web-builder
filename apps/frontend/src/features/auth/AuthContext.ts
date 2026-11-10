import { createContext } from 'react';
import type { User } from '../../types';
import type { AuthSession, AuthStatus } from '../../types/auth';

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  signIn: (session: AuthSession) => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
