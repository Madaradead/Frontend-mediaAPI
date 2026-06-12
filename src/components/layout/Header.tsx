'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { PlayCircle } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { token, user, logout, isHydrated } = useAuthStore();

  const isAuthenticated = !!token;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-6">
      <Link href="/" className="flex items-center gap-2">
        <PlayCircle className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold tracking-tight">MediaApp</span>
      </Link>

      <div className="flex items-center gap-4">
        {isHydrated ? (
          isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">
                Hello, {user?.username}
              </span>
              <Button variant="destructive" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )
        ) : (
          <div className="h-10 w-32 animate-pulse bg-muted rounded" />
        )}
      </div>
    </header>
  );
}
