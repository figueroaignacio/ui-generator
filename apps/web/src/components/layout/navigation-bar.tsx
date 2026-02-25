import { ArrowRight } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { Logo } from '../shared/logo';

export function NavigationBar() {
  return (
    <nav className="flex w-full items-center justify-between">
      <Link href="/" className="flex items-center gap-x-2">
        <Logo />
        <span className="font-heading font-bold gradient-text">NachAI</span>
      </Link>

      <Link href="/get-started">
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full px-5"
          rightIcon={<HugeiconsIcon icon={ArrowRight} />}
        >
          Get Started
        </Button>
      </Link>
    </nav>
  );
}
