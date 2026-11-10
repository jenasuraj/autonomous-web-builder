import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import type {
  AuthSession,
  AuthStatus,
  RegisterResponse,
} from '../../types/auth';
import {
  loginUser,
  logoutUser,
  registerUser,
  resendOtp,
  validateSession,
  verifyOtp,
} from './authThunks';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  expiresAt: number | null;
  pending: RegisterResponse | null; // signup waiting for its OTP
  loading: boolean;
  error: string;
  notice: string;
  validateId: string | null; // only the latest validate request may update the session
}

const initialState: AuthState = {
  status: 'loading',
  user: null,
  expiresAt: null,
  pending: null,
  loading: false,
  error: '',
  notice: '',
  validateId: null,
};

const signIn = (state: AuthState, { user, expiresAt }: AuthSession) => {
  state.status = 'authenticated';
  state.user = user;
  state.expiresAt = Date.parse(expiresAt);
  state.pending = null;
  state.validateId = null;
};

const signOut = (state: AuthState) => {
  state.status = 'unauthenticated';
  state.user = null;
  state.expiresAt = null;
  state.validateId = null;
};

const formThunks = [loginUser, registerUser, verifyOtp, resendOtp] as const;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = '';
      state.notice = '';
    },
    cancelRegistration: (state) => {
      state.pending = null;
      state.error = '';
      state.notice = '';
    },
    sessionExpired: signOut,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.pending = payload;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.notice = 'A new code is on its way.';
      })
      .addCase(validateSession.pending, (state, { meta }) => {
        state.validateId = meta.requestId;
      })
      .addCase(validateSession.fulfilled, (state, { payload, meta }) => {
        if (meta.requestId !== state.validateId) return;
        if (payload.authenticated) signIn(state, payload);
        else signOut(state);
      })
      .addCase(validateSession.rejected, (state, { meta }) => {
        if (meta.requestId === state.validateId) signOut(state);
      })
      .addCase(logoutUser.pending, (state) => {
        state.validateId = null;
      })
      .addMatcher(isAnyOf(logoutUser.fulfilled, logoutUser.rejected), signOut)
      .addMatcher(
        isAnyOf(loginUser.fulfilled, verifyOtp.fulfilled),
        (state, { payload }: PayloadAction<AuthSession>) =>
          signIn(state, payload),
      )
      .addMatcher(isAnyOf(...formThunks.map((t) => t.pending)), (state) => {
        state.loading = true;
        state.error = '';
        state.notice = '';
      })
      .addMatcher(isAnyOf(...formThunks.map((t) => t.fulfilled)), (state) => {
        state.loading = false;
      })
      .addMatcher(
        isAnyOf(...formThunks.map((t) => t.rejected)),
        (state, { payload }) => {
          state.loading = false;
          state.error = payload ?? 'Something went wrong';
        },
      );
  },
});

export const { clearMessages, cancelRegistration, sessionExpired } =
  authSlice.actions;
export default authSlice.reducer;
