import './globals.css';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bagaicha Dharan',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-secondary">
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
