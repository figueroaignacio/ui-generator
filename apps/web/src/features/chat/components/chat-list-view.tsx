'use client';

import { useConversations } from '@/features/chat/hooks/use-conversations';
import { Chat01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { useState } from 'react';
import { ChatListItem } from './chat-list-item';

const SKELETON_ITEMS = Array.from({ length: 8 });

export function ChatListView() {
  const { conversations, isLoading, deleteConversation } = useConversations();
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeletingId(id);
    try {
      await deleteConversation(id);
    } finally {
      setIsDeletingId(null);
    }
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex flex-col h-full max-w-3xl mx-auto w-full p-8 gap-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-lg" />
        <div className="space-y-4">
          {SKELETON_ITEMS.map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full p-8 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Your Creations</h1>
        <p className="text-sm text-muted-foreground">
          A curated list of everything you&apos;ve built with NachAI.
        </p>
      </div>
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/50">
          <HugeiconsIcon icon={Chat01Icon} size={32} className="text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No conversations yet.</p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/chat/new">Start a new one</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border/50">
          {conversations.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              onDelete={handleDelete}
              isDeleting={isDeletingId === chat.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
