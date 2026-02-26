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
  isStreaming?: boolean;
}

const messageInitial = { opacity: 0, scale: 0.98, y: 4 };
const messageAnimate = { opacity: 1, scale: 1, y: 0 };
const messageTransition = { duration: 0.2, ease: 'easeOut' as const };

const heartbeatInitial = { scale: 0.5, opacity: 0 };
const heartbeatAnimate = { scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] };
const heartbeatTransition = { duration: 2, repeat: Infinity, ease: 'easeInOut' as const };

export function ChatMessage({ message, username, avatarUrl, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={messageInitial}
      animate={messageAnimate}
      transition={messageTransition}
      className={cn('flex gap-3 w-full items-start', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-full rounded-2xl text-sm leading-relaxed transition-all duration-500 relative',
          isUser
            ? 'bg-card rounded-tr-sm px-4 py-2.5 shadow-sm ring-1 ring-border/50 w-fit'
            : 'text-foreground px-0',
          isStreaming &&
            !isUser &&
            'before:absolute before:inset-0 before:rounded-2xl before:bg-primary/5 before:animate-pulse before:-z-10',
        )}
      >
        {isStreaming && !isUser && (
          <div className="absolute -left-4 top-2.5">
            <motion.div
              initial={heartbeatInitial}
              animate={heartbeatAnimate}
              transition={heartbeatTransition}
              className="w-1.5 h-1.5 rounded-full bg-secondary-foreground"
            />
          </div>
        )}
        <MarkdownRenderer content={message.content} isStreaming={isStreaming} />
      </div>
    </motion.div>
  );
}
