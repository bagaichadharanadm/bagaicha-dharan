import { logoutActions } from '@/actions';
import { Button } from '@/components/ui/button';

export function LogoutForm() {
  return (
    <form action={logoutActions.logout}>
      <Button type="submit">logout</Button>
    </form>
  );
}
