'use client';

import { Logo } from '../shared/logo';

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-2">
        <Logo />
        <span className="font-mono font-semibold">NachAI</span>
      </div>
    </nav>
  );
}
