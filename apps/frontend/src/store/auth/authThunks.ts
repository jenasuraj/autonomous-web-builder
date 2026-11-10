import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';
import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ValidateResponse,
} from '../../types/auth';
import { getErrorMessage } from '../../utils/helpers';
import type { RootState } from '../index';

const thunk = createAsyncThunk.withTypes<{
  state: RootState;
  rejectValue: string;
}>();

export const loginUser = thunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthSession>('/auth/login', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const registerUser = thunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<RegisterResponse>(
        '/auth/register',
        payload,
      );
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const verifyOtp = thunk(
  'auth/verifyOtp',
  async (code: string, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthSession>('/auth/verify-otp', {
        registrationId: getState().auth.pending?.registrationId,
        code,
      });
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const resendOtp = thunk(
  'auth/resendOtp',
  async (_: void, { getState, rejectWithValue }) => {
    try {
      await api.post('/auth/resend-otp', {
        registrationId: getState().auth.pending?.registrationId,
      });
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const validateSession = thunk('auth/validate', async () => {
  const { data } = await api.get<ValidateResponse>('/auth/validate');
  return data;
});

export const logoutUser = thunk('auth/logout', async () => {
  await api.post('/auth/logout');
});
