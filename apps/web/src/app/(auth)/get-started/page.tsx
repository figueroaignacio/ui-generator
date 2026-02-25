'use client';

import { BackButton } from '@/components/shared/back-button';
import { LoginCardInner } from '@/features/auth/components/login-card';
import { Suspense } from 'react';

export default function GetStartedPage() {
  return (
    <>
      <div className="ml-3 mt-3">
        <BackButton />
      </div>
      <div className="relative flex min-h-screen w-full items-center justify-center bg-background px-4 py-20">
        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
          <div className="text-center mb-10 space-y-3">
            <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
              Start building with NachAI
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              The most advanced AI UI generator at your fingertips.
            </p>
          </div>
          <div className="w-full">
            <Suspense>
              <LoginCardInner showHeader={false} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
