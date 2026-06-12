'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Library, Upload, User } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Library', href: '/media', icon: Library },
    { name: 'Upload', href: '/media/upload', icon: Upload },
    { name: 'My Uploads', href: '/my-media', icon: User },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/20 md:flex min-h-screen">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Streaming Media
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
