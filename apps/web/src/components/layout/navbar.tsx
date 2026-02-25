'use client';

import { useUIStore } from '@/features/chat/store/ui.store';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { Logo } from '../shared/logo';

export function Navbar() {
  const { setAuthDialogOpen } = useUIStore();

  return (
    <nav className="flex w-full items-center justify-between">
      <Link href="/" className="flex items-center gap-x-2">
        <Logo />
        <span className="font-heading font-bold gradient-text">NachAI</span>
      </Link>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full px-5 h-9 font-medium"
          onClick={() => setAuthDialogOpen(true)}
        >
          Log in
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full px-5 h-9 font-medium hidden sm:flex"
          onClick={() => setAuthDialogOpen(true)}
        >
          Try for free
        </Button>
      </div>
    </nav>
  );
}
