import type { User } from '../../../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  registrationId: string;
}

export interface VerifyOtpPayload {
  registrationId: string;
  code: string;
}

export interface AuthSession {
  user: User;
  expiresAt: string;
}

export type ValidateResponse =
  ({ authenticated: true } & AuthSession) | { authenticated: false };

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
