import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { GitHubIcon } from '../shared/tech-icons';

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl tracking-tight">
          NachAI
        </Link>
      </div>
      <div>
        <Button leftIcon={<GitHubIcon />} variant="outline" size="sm">
          Continue with GitHub
        </Button>
      </div>
    </nav>
  );
}
