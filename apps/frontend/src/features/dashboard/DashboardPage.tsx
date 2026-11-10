import EmptyProjects from '../../components/dashboard/EmptyProjects';
import { APP_NAME } from '../../utils/helpers';
import { useAuth } from '../auth/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <section className="mx-auto max-w-5xl px-4 pt-28 pb-16">
      <title>{`Dashboard — ${APP_NAME}`}</title>
      <p className="text-sm font-medium text-indigo-400">Dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Welcome, {user?.name}
      </h1>
      <p className="mt-1 text-zinc-400">{user?.email}</p>
      <EmptyProjects />
    </section>
  );
}
