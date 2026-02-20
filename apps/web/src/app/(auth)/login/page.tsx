import { BackButton } from '@/components/shared/back-button';
import { LoginCard } from '@/features/auth/components/login-card';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense>
      <BackButton />
      <LoginCard />
    </Suspense>
  );
}
