import { LogOut } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from './useAuth';
import { getInitials } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import { buttonStyles } from '../../components/ui/buttonStyles';

export default function AuthButtons() {
  const { status, user, signOut } = useAuth();
  if (status === 'loading') return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {user ? (
        <>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 py-1 pr-3 pl-1 text-sm backdrop-blur">
            <span className="grid size-7 place-items-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 text-xs font-semibold">
              {getInitials(user.name)}
            </span>
            {user.name}
          </span>
          <Button
            variant="secondary"
            className="px-4! py-2! backdrop-blur"
            onClick={() => void signOut()}
          >
            <LogOut className="size-4" /> Log out
          </Button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className={buttonStyles('secondary', 'px-4! py-2! backdrop-blur')}
          >
            Log in
          </Link>
          <Link
            to="/login?mode=register"
            className={buttonStyles('primary', 'px-4! py-2!')}
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
}
