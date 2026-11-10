import { Navigate, Outlet, useLocation } from 'react-router';
import PageLoader from '../../components/ui/PageLoader';
import { useAppSelector } from '../../store';

export default function ProtectedRoute() {
  const status = useAppSelector((s) => s.auth.status);
  const { pathname } = useLocation();
  if (status === 'loading') return <PageLoader />;
  if (status === 'unauthenticated')
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  return <Outlet />;
}
