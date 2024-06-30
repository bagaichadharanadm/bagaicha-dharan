import { Drawer } from '@/components/dashboard/drawer';
import { Header } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-hide bg-gray-100">{children}</div>
      </div>
    </div>
  );
}
