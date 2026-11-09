import { FolderPlus } from 'lucide-react';
import { APP_NAME } from '../../../utils/helpers';
import { useAuth } from '../../auth/hooks/useAuth';

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
      <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
        <FolderPlus className="size-8 text-zinc-600" />
        <p className="mt-4 font-medium">No projects yet</p>
        <p className="mt-1 text-sm text-zinc-500">
          Your projects will show up here.
        </p>
      </div>
    </section>
  );
}
