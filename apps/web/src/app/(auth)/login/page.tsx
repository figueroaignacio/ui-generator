import { LoginCardInner } from '@/features/auth/components/login-card';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Suspense>
        <LoginCardInner />
      </Suspense>
    </div>
  );
}
