import { Chat01Icon, PencilEdit01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarNavProps {
  collapsed: boolean;
  onAction?: () => void;
}

export function SidebarNav({ collapsed, onAction }: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleAction = (cb: () => void) => {
    cb();
    onAction?.();
  };

  const items = [
    {
      icon: Search01Icon,
      label: 'Search',
      href: '/chat/search',
    },
    {
      icon: PencilEdit01Icon,
      label: 'New Conversation',
      href: '/chat/new',
    },
    {
      icon: Chat01Icon,
      label: 'Chats',
      href: '/chat/all',
    },
  ];

  return (
    <nav className="flex flex-col gap-1 p-2">
      {items.map(({ icon, label, href }) => {
        const isActive = pathname === href;
        return (
          <button
            key={label}
            onClick={() => handleAction(() => router.push(href))}
            title={collapsed ? label : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group',
              isActive ? 'bg-card ' : 'hover:bg-card text-muted-foreground hover:text-foreground',
              collapsed && 'justify-center px-0',
            )}
          >
            <HugeiconsIcon
              icon={icon}
              size={20}
              className={cn(
                'shrink-0 transition-transform group-hover:scale-110',
                isActive && 'scale-110',
                !collapsed && 'ml-0.5',
              )}
            />
            {!collapsed && <span className="truncate">{label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
