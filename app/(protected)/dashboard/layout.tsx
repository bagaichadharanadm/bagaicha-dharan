import { Drawer } from '@/components/dashboard/drawer';
import { Header } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Drawer */}
        <div className="flex-shrink-0 lg:w-64 md:w-48 sm:w-32 w-20 overflow-y-auto scrollbar-hide border-r border-slate-200 bg-slate-100">
          <Drawer />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-hide bg-slate-50">{children}</div>
      </div>
    </div>
  );
}
