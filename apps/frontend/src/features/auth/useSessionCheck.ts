import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store';
import { sessionExpired } from '../../store/auth/authSlice';
import { validateSession } from '../../store/auth/authThunks';

const MAX_TIMEOUT_MS = 2 ** 31 - 1;

/** Re-validates the cookie on every route change and logs out the moment the token expires. */
export const useSessionCheck = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const expiresAt = useAppSelector((s) => s.auth.expiresAt);

  useEffect(() => {
    void dispatch(validateSession());
  }, [dispatch, pathname]);

  useEffect(() => {
    if (!expiresAt) return;
    const timeout = setTimeout(
      () => dispatch(sessionExpired()),
      Math.min(expiresAt - Date.now(), MAX_TIMEOUT_MS),
    );
    return () => clearTimeout(timeout);
  }, [dispatch, expiresAt]);
};
