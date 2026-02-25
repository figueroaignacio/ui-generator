'use client';

import { useConversations } from '@/features/chat/hooks/use-conversations';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export function SearchView() {
  const { conversations, isLoading } = useConversations();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [conversations, searchQuery]);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) {
      return d.toLocaleDateString('en-US', { weekday: 'long' });
    }
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 w-full max-w-3xl mx-auto"
    >
      <h1 className="text-4xl font-normal text-foreground">Search</h1>

      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <HugeiconsIcon
            icon={Search01Icon}
            size={22}
            className="text-muted-foreground group-focus-within:text-primary transition-colors"
          />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search conversations"
          className="w-full h-14 pl-14 pr-6 bg-secondary/30 ring-1 ring-border border-none hover:ring-border-hover focus:ring-primary/40 focus:bg-secondary/50 rounded-full text-lg transition-all outline-none"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <h2 className="text-base font-medium text-foreground/80 px-1">Recent</h2>

        <div className="flex flex-col -mx-1">
          {isLoading ? (
            <div className="flex flex-col gap-4 py-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-14 bg-secondary/20 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="flex flex-col border-t border-border/10">
              {filteredConversations.map(conversation => (
                <Link
                  key={conversation.id}
                  href={`/chat/c/${conversation.id}`}
                  className="group flex items-center justify-between py-4 px-4 hover:bg-secondary/30 transition-all rounded-xl border-b border-border/5"
                >
                  <span className="text-base text-foreground/80 group-hover:text-foreground transition-colors truncate pr-4">
                    {conversation.title || 'Untitled Conversation'}
                  </span>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(conversation.updatedAt)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-border/20">
              No conversations found.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
