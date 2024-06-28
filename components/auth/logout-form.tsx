import { logoutActions } from '@/actions';
import { Button } from '@/components/ui/button';

export function LogoutForm() {
  return (
    <form action={logoutActions.logout} className="mt-4">
      <Button
        type="submit"
        className="w-full bg-rose-300/25  text-rose-950 text-xs hover:bg-rose-300/35 border border-rose-300/20"
        variant={'outline'}
      >
        Logout
      </Button>
    </form>
  );
}
