import Link from 'next/link';

export function NavigationBar() {
  return (
    <nav className="flex w-full items-center justify-between">
      <Link href="/" className="font-bold text-xl tracking-tight">
        NachAI
      </Link>
      <button className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
        Continue with GitHub
      </button>
    </nav>
  );
}
