'use client';

import { useConversations } from '@/features/chat/hooks/use-conversations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SidebarConversationItem } from './sidebar-conversation-item';

interface SidebarHistoryProps {
  onAction?: () => void;
}

export function SidebarHistory({ onAction }: SidebarHistoryProps) {
  const { conversations, isLoading, deleteConversation } = useConversations();
  const slicedConversations = useMemo(() => conversations.slice(0, 6), [conversations]);
  const pathname = usePathname();
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeletingId(id);
    try {
      await deleteConversation(id);
    } finally {
      setIsDeletingId(null);
    }
  };

  const SKELETON_ITEMS_HISTORY = Array.from({ length: 5 });

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden mt-6 px-4 gap-4">
        {SKELETON_ITEMS_HISTORY.map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 w-full bg-secondary rounded-md animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && conversations.length === 0) {
    return <div className="px-5 py-4 text-xs text-muted-foreground italic">No conver...</div>;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden mt-4">
      <p className="px-5 pb-2 text-xs font-semibold text-foreground/70 uppercase tracking-wider">
        Recent Conversations
      </p>
      <ul className="flex flex-col overflow-y-auto px-2 pb-2 gap-0.5">
        {slicedConversations.map(chat => {
          const href = `/chat/c/${chat.id}`;
          const isActive = pathname === href;
          return (
            <SidebarConversationItem
              key={chat.id}
              chat={chat}
              isActive={isActive}
              onAction={onAction}
              onDelete={handleDelete}
              isDeleting={isDeletingId === chat.id}
            />
          );
        })}
      </ul>
      {conversations.length > 6 && (
        <div className="px-2 pb-2">
          <Link
            href="/chat/all"
            onClick={onAction}
            className="flex items-center justify-center w-full py-2 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground rounded-lg transition-colors border border-dashed border-border/50 hover:border-border"
          >
            View all ({conversations.length})
          </Link>
        </div>
      )}
    </div>
  );
}
