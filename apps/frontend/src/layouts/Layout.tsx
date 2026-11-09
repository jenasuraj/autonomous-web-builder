import { Outlet } from 'react-router';
import AuthButtons from '../components/shared/AuthButtons';
import AuthProvider from '../features/auth/components/AuthProvider';

export default function Layout() {
  return (
    <AuthProvider>
      <AuthButtons />
      <main className="min-h-screen overflow-x-clip">
        <Outlet />
      </main>
    </AuthProvider>
  );
}
