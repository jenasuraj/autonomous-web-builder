import { LoaderCircle } from 'lucide-react';

export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="grid min-h-screen place-items-center"
    >
      <LoaderCircle className="size-6 animate-spin text-zinc-500" />
    </div>
  );
}
