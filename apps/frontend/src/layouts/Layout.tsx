import { Outlet } from 'react-router';
import AuthButtons from '../features/auth/AuthButtons';
import { useSessionCheck } from '../features/auth/useSessionCheck';

export default function Layout() {
  useSessionCheck();
  return (
    <>
      <AuthButtons />
      <main className="min-h-screen overflow-x-clip">
        <Outlet />
      </main>
    </>
  );
}
