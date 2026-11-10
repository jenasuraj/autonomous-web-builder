import { Outlet } from 'react-router';
import AuthButtons from '../features/auth/AuthButtons';
import AuthProvider from '../features/auth/AuthProvider';

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
