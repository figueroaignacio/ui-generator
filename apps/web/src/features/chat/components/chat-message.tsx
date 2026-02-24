'use client';

import { cn } from '@repo/ui/lib/cn';
import { motion } from 'motion/react';
import { MarkdownRenderer } from './markdown-renderer';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
  avatarUrl?: string;
  username?: string;
}

export function ChatMessage({ message, username, avatarUrl }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex gap-3 w-full items-start', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-card rounded-tr-sm px-4 py-2.5 shadow-sm ring-1 ring-border/50 w-fit'
            : 'text-foreground px-0',
        )}
      >
        <MarkdownRenderer content={message.content} />
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden mt-0.5 ring-2 ring-border shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username ?? 'You'} className="object-cover w-full h-full" />
          ) : (
            <span className="text-xs font-bold bg-muted text-muted-foreground w-full h-full flex items-center justify-center">
              {(username?.[0] ?? 'U').toUpperCase()}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
