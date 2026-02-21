'use client';

import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const status = useAuthStore(s => s.status);
  const loadingMessage = useAuthStore(s => s.loadingMessage);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <AuthGuardSpinner message={loadingMessage} />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}

function AuthGuardSpinner({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <HugeiconsIcon icon={Loading03Icon} size={24} className="animate-spin" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
