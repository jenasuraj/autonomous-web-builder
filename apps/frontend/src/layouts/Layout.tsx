import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <Outlet />
    </main>
  );
}
