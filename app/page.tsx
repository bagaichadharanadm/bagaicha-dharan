import { Button } from '@/components/ui/button';
import { auth_login_route } from '@/constants/links';
import { dashboard_home_page_route } from '@/constants/links';
import getUserSessionAndRole from '@/lib/get-user-session-and-role';
import bagaichaLogo from '@/public/images/bagaicha-logo.png';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

// Importing the Poppins font with the specified subsets and weight
const poppins = Poppins({ subsets: ['latin'], weight: '400' });

export default async function Page() {
  // Fetching user session and role information
  const user = await getUserSessionAndRole();

  return (
    <div className="w-screen h-screen">
      <header className={`flex gap-4 items-center justify-between ${poppins.className} p-4 border-b-2`}>
        {/* Displaying the Bagaicha logo */}
        <Image src={bagaichaLogo} alt="bagaicha-logo" width={100} />
        <div className="flex flex-col items-end">
          <h1 className="text-3xl text-center font-semibold text-green-800">Bagaicha</h1>
          <h3 className="text-xl text-yellow-500 whitespace-nowrap">Restro &amp; Bar</h3>
        </div>
        <div>
          {/* Conditionally rendering Login or Dashboard button based on user sign-in status */}
          {!user.isSignedIn && (
            <Link href={auth_login_route}>
              <Button variant={'outline'}>Login</Button>
            </Link>
          )}
          {user.isSignedIn && (
            <Link href={dashboard_home_page_route}>
              <Button variant={'outline'}>Dashboard</Button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}

// Exporting dynamic configuration for this page
export const dynamic = 'force-dynamic';
