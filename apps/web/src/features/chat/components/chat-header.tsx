'use client';

import { useUIStore } from '@/features/chat/store/ui.store';
import { Menu01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { UserMenu } from './user-menu';

export function ChatHeader() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="flex items-center justify-between px-3 h-14 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
          aria-label="Toggle sidebar"
        >
          <HugeiconsIcon icon={Menu01Icon} size={22} />
        </button>
        <Link href="/chat" className="flex items-center px-2 group">
          <span className="font-heading font-bold text-xl tracking-tight text-foreground transition-all duration-300">
            NachAI
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2 px-1">
        <Link
          href="/chat/search"
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <HugeiconsIcon icon={Search01Icon} size={20} />
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
