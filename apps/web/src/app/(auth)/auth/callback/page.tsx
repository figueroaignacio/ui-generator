'use client';

import { getAuthStatus } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser, clearAuth } = useAuthStore();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    getAuthStatus()
      .then(({ authenticated, user }) => {
        if (authenticated && user) {
          setUser(user);
          router.replace('/chat');
        } else {
          clearAuth();
          router.replace('/login?error=OAuthCallback');
        }
      })
      .catch(() => {
        clearAuth();
        router.replace('/login?error=OAuthCallback');
      });
  }, [router, setUser, clearAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
