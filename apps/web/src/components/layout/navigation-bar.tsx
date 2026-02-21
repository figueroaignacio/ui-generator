'use client';

import { Logo } from '../shared/logo';

export function NavigationBar() {
  return (
    <nav className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-2">
        <Logo />
        <span>NachAI</span>
      </div>
    </nav>
  );
}
