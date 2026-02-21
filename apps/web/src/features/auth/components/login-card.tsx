'use client';

import { Logo } from '@/components/shared/logo';
import { GitHubIcon } from '@/components/shared/tech-icons';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';

const ERROR_MESSAGES: Record<string, string> = {
  OAuthCallback: 'Something went wrong with GitHub. Please try again.',
  OAuthSignin: 'Could not sign in with GitHub.',
  AccessDenied: 'Access denied. Please authorize the app in GitHub.',
  default: 'Something went wrong. Please try again.',
};

export function LoginCardInner() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const errorKey = searchParams.get('error');
  const errorMessage = errorKey ? (ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.default) : null;
  const [isLoading, setIsLoading] = useState(false);

  function handleLogin() {
    setIsLoading(true);
    login();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
          <Logo />
        </div>
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          NachAI
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">UI components powered by AI</p>
      </div>
      <Card className="border-border shadow-lg">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="text-base">Get started for free</CardTitle>
          <CardDescription>
            Connect your GitHub account and start generating components in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {errorMessage && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}
          <Button
            onClick={handleLogin}
            loading={isLoading}
            leftIcon={<GitHubIcon />}
            className="w-full"
            size="sm"
            variant="secondary"
          >
            Continue with GitHub
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
              Terms of Service
            </span>
            {' and '}
            <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
              Privacy Policy
            </span>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginCard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <LoginCardInner />
    </div>
  );
}
