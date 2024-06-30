import { HeaderNavigation } from '@/components/dashboard/header-navigation';

export function Header() {
  return (
    <header className="p-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
      <HeaderNavigation />
    </header>
  );
}
