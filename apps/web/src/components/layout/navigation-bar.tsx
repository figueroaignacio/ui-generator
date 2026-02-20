import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { GitHubIcon } from '../shared/tech-icons';

export function NavigationBar() {
  return (
    <nav className="flex w-full items-center justify-between">
      <Link href="/" className="font-bold text-xl tracking-tight">
        NachAI
      </Link>
      <Button leftIcon={<GitHubIcon />} variant="outline" size="sm">
        Continue with GitHub
      </Button>
    </nav>
  );
}
