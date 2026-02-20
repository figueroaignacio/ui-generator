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

export function LoginCard() {
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Logo />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            NachAI
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">UI components powered by AI</p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-lg">Welcome back</CardTitle>
            <CardDescription>
              Sign in with your GitHub account to start generating components.
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

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Only your GitHub username and avatar are used. We never access your code.
        </p>
      </div>
    </div>
  );
}
