'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';

export default function Chat() {
  const { user, logout } = useAuth();

  return (
    <section className="p-8">
      <h1 className="text-xl font-semibold mb-4">Chat — Session Debug</h1>
      <pre className="rounded-lg border border-border bg-muted p-4 text-sm text-foreground overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
      <button
        onClick={logout}
        className="mt-4 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
      >
        Logout
      </button>
    </section>
  );
}
