'use client';

import { Add01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { useRouter } from 'next/navigation';

interface SidebarNavProps {
  collapsed: boolean;
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const router = useRouter();

  const items = [
    { icon: Add01Icon, label: 'New chat', onClick: () => router.push('/chat/new') },
    { icon: Search01Icon, label: 'Search', onClick: () => {} },
  ];

  return (
    <nav className="flex flex-col gap-0.5 p-2">
      {items.map(({ icon, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          title={collapsed ? label : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground',
            'hover:bg-accent hover:text-foreground transition-colors w-full text-left',
            collapsed && 'justify-center',
          )}
        >
          <HugeiconsIcon icon={icon} size={17} className="shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </button>
      ))}
    </nav>
  );
}
