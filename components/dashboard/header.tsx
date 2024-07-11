import { LogoutForm } from '@/components/auth/logout-form';
import { HeaderNavigation } from '@/components/dashboard/header-navigation';
import getUserSessionAndRole from '@/lib/get-user-session-and-role';

export async function Header() {
  const user = await getUserSessionAndRole();

  return (
    <header className="p-4 border-b flex justify-between items-cente">
      <HeaderNavigation />
      {user.isSignedIn && <LogoutForm />}
    </header>
  );
}
