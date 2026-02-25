import { PencilEdit01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { useRouter } from 'next/navigation';

interface SidebarNavProps {
  collapsed: boolean;
  onAction?: () => void;
}

export function SidebarNav({ collapsed, onAction }: SidebarNavProps) {
  const router = useRouter();

  const handleAction = (cb: () => void) => {
    cb();
    onAction?.();
  };

  const items = [
    {
      icon: Search01Icon,
      label: 'Search',
      onClick: () => handleAction(() => router.push('/chat/search')),
    },
    {
      icon: PencilEdit01Icon,
      label: 'New Conversation',
      onClick: () => handleAction(() => router.push('/chat/new')),
    },
  ];

  return (
    <nav className="flex flex-col gap-1 p-2">
      {items.map(({ icon, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          title={collapsed ? label : undefined}
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group',
            'hover:bg-muted text-muted-foreground hover:text-foreground',
            collapsed && 'justify-center px-0',
          )}
        >
          <HugeiconsIcon
            icon={icon}
            size={20}
            className={cn(
              'shrink-0 transition-transform group-hover:scale-110',
              !collapsed && 'ml-0.5',
            )}
          />
          {!collapsed && <span className="truncate">{label}</span>}
        </button>
      ))}
    </nav>
  );
}
