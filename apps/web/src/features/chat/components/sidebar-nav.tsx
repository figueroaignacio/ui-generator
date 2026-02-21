'use client';

import { Add01Icon, MessageMultiple01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';

interface SidebarNavProps {
  collapsed: boolean;
}

const NAV_ITEMS = [
  { icon: Add01Icon, label: 'New chat', onClick: () => {} },
  { icon: Search01Icon, label: 'Search', onClick: () => {} },
  { icon: MessageMultiple01Icon, label: 'Chats', onClick: () => {} },
];

export function SidebarNav({ collapsed }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-0.5 p-2 border-b border-border/50">
      {NAV_ITEMS.map(({ icon, label, onClick }) => (
        <SidebarNavItem
          key={label}
          icon={icon}
          label={label}
          collapsed={collapsed}
          onClick={onClick}
        />
      ))}
    </nav>
  );
}

interface SidebarNavItemProps {
  icon: IconSvgElement;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
  active?: boolean;
}

export function SidebarNavItem({ icon, label, collapsed, onClick, active }: SidebarNavItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground',
        'hover:bg-accent hover:text-foreground transition-colors w-full text-left',
        collapsed && 'justify-center',
        active && 'bg-accent text-foreground',
      )}
    >
      <HugeiconsIcon icon={icon} size={17} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
