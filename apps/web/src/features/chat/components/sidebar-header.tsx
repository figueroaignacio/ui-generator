'use client';

import { PanelRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center border-b border-border/50 py-3 shrink-0',
        collapsed ? 'justify-center px-0' : 'justify-between px-3',
      )}
    >
      {!collapsed && (
        <span className="font-heading font-semibold text-sm tracking-tight">NachAI</span>
      )}
      <button
        onClick={onToggle}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <HugeiconsIcon icon={PanelRightIcon} size={16} />
      </button>
    </div>
  );
}
