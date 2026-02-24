'use client';

import { cn } from '@repo/ui/lib/cn';
import { motion } from 'motion/react';

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

export function ChatMessage({ message, avatarUrl, username }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex gap-3 w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser ? 'bg-primary text-primary-foreground rounded-br-sm' : 'px-0',
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
      </div>
      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full overflow-hidden mt-0.5 ring-2 ring-border">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username ?? 'You'} className="object-cover w-full h-full" />
          ) : (
            <span className="text-xs font-semibold bg-muted text-muted-foreground w-full h-full flex items-center justify-center">
              {(username?.[0] ?? 'U').toUpperCase()}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
