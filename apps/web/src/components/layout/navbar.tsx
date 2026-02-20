'use client';

import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonVariants } from '@repo/ui/components/button';
import Link from 'next/link';
import { Logo } from '../shared/logo';

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between">
      <div className="flex flex-col items-center gap-x-2">
        <Logo />
        <span className="font-mono font-semibold">NachAI</span>
      </div>
      <div>
        <Link href="/login" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          Get Started <HugeiconsIcon icon={ArrowRight02Icon} />
        </Link>
      </div>
    </nav>
  );
}
