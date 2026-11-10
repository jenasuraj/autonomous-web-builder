import { api } from '../../lib/api';
import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ValidateResponse,
  VerifyOtpPayload,
} from '../../types/auth';

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<AuthSession>('/auth/login', payload);
  return data;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post<RegisterResponse>('/auth/register', payload);
  return data;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const { data } = await api.post<AuthSession>('/auth/verify-otp', payload);
  return data;
};

export const resendOtp = async (registrationId: string) => {
  await api.post('/auth/resend-otp', { registrationId });
};

export const validateSession = async () => {
  const { data } = await api.get<ValidateResponse>('/auth/validate');
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};
