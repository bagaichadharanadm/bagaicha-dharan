import { logoutActions } from '@/actions';
import { Button } from '@/components/ui/button';

export function LogoutForm() {
  return (
    <form action={logoutActions.logout} className="mt-4">
      <Button type="submit" className="" variant={'destructive'}>
        Logout
      </Button>
    </form>
  );
}
