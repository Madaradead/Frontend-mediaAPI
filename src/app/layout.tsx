import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import QueryProvider from '@/providers/QueryProvider';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Streaming Media Service',
  description: 'Manage and stream your media content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex min-h-screen flex-col">
            <Header />

            <div className="flex flex-1">
              <Sidebar />

              <main className="flex-1 bg-background">{children}</main>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
