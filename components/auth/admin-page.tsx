'use client';

import { useSession } from 'next-auth/react';

import { Unauthorized } from './unauthorized';

export function AdminPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();
  return session.data?.user && session.data.user.role === 'ADMIN' ? <>{children}</> : <Unauthorized />;
}
