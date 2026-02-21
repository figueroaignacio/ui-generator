'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';

export default function Chat() {
  const { user } = useAuth();

  return (
    <section className="p-8">
      <h1 className="text-xl font-semibold mb-4">Chat — Session Debug</h1>
      <pre className="rounded-lg border border-border bg-card p-4 text-sm text-foreground overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </section>
  );
}
