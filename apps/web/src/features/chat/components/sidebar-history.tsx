'use client';

import { useConversations } from '@/features/chat/hooks/use-conversations';
import { cn } from '@repo/ui/lib/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarHistoryProps {
  onAction?: () => void;
}

export function SidebarHistory({ onAction }: SidebarHistoryProps) {
  const { conversations } = useConversations();
  const pathname = usePathname();

  if (conversations.length === 0) {
    return <div className="px-4 py-4 text-xs text-muted-foreground">No conversations yet.</div>;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <p className="px-4 pt-4 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Recent
      </p>
      <ul className="flex flex-col overflow-y-auto px-2 pb-2 gap-0.5">
        {conversations.map(chat => {
          const href = `/chat/c/${chat.id}`;
          const isActive = pathname === href;
          return (
            <li key={chat.id}>
              <Link
                href={href}
                onClick={onAction}
                className={cn(
                  'flex items-center gap-2.5 w-full rounded-lg px-2 py-2 text-sm transition-colors text-left',
                  isActive
                    ? 'bg-card text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground',
                )}
              >
                <span className="truncate">{chat.title ?? 'Thinking in a title...'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
