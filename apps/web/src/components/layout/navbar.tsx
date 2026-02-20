import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl tracking-tight">
          NachAI
        </Link>
      </div>
      <div>
        <Button>Continue with GitHub</Button>
      </div>
    </nav>
  );
}
