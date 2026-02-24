'use client';

import { PanelRightIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import Link from 'next/link';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center py-3 h-14 shrink-0 px-3',
        collapsed ? 'justify-center' : 'justify-between',
      )}
    >
      <button
        onClick={onToggle}
        className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <HugeiconsIcon icon={PanelRightIcon} size={20} />
      </button>

      {!collapsed && (
        <Link
          href="/chat/search"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          aria-label="Search"
        >
          <HugeiconsIcon icon={Search01Icon} size={18} />
        </Link>
      )}
    </div>
  );
}
