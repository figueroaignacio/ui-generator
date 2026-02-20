import { LoginCard } from '@/features/auth/components/login-card';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginCard />
    </Suspense>
  );
}
