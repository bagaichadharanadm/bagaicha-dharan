import { ShadowOuterIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { LogoutForm } from '../auth/logout-form';

export function Drawer() {
  const drawerItems = [
    { name: 'expense tracking', href: '/dashboard/expense-tracking' },
    { name: 'dev - wip -1', href: '/dashboard/dev-wip-1' },
    { name: 'dev - wip -2', href: '/dashboard/dev-wip-2' },
    { name: 'dev - wip -3', href: '/dashboard/dev-wip-3' },
    { name: 'dev - wip -4', href: '/dashboard/dev-wip-3' },
  ];

  return (
    <div className="h-full flex flex-col w-full">
      {drawerItems.map((item, index) => (
        <div key={index} className="w-full">
          <Link href={item.href}>
            <div className="flex items-center p-3 text-sm text-gray-800 hover:bg-gray-300 hover:text-slate-500 transition duration-300 ease-in-out cursor-pointer">
              <ShadowOuterIcon className="w-3 h-3 mr-2 text-gray-400" />
              <span>{item.name}</span>
            </div>
          </Link>
        </div>
      ))}
      <div className="p-3">
        <LogoutForm />
      </div>
    </div>
  );
}
