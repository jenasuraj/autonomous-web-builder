import { FolderPlus } from 'lucide-react';

export default function EmptyProjects() {
  return (
    <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
      <FolderPlus className="size-8 text-zinc-600" />
      <p className="mt-4 font-medium">No projects yet</p>
      <p className="mt-1 text-sm text-zinc-500">
        Your projects will show up here.
      </p>
    </div>
  );
}
