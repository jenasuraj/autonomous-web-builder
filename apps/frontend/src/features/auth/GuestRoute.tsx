import { Navigate, Outlet, useLocation } from 'react-router';
import PageLoader from '../../components/ui/PageLoader';
import { useAppSelector } from '../../store';

/** Pages only for logged-out visitors; signed-in users go to where they were headed, or the dashboard. */
export default function GuestRoute() {
  const status = useAppSelector((s) => s.auth.status);
  const { state } = useLocation();
  if (status === 'loading') return <PageLoader />;
  if (status === 'authenticated') {
    return (
      <Navigate
        to={(state as { from?: string } | null)?.from ?? '/dashboard'}
        replace
      />
    );
  }
  return <Outlet />;
}
