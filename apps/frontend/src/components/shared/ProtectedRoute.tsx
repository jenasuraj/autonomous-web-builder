import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import PageLoader from '../ui/PageLoader';

export default function ProtectedRoute() {
  const { status } = useAuth();
  const { pathname } = useLocation();
  if (status === 'loading') return <PageLoader />;
  if (status === 'unauthenticated')
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  return <Outlet />;
}
