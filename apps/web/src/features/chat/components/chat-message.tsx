'use client';

import { cn } from '@repo/ui/lib/cn';
import { motion, useReducedMotion } from 'motion/react';
import { MarkdownRenderer } from './markdown-renderer';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

const messageInitial = { opacity: 0, scale: 0.98, y: 10 };
const messageAnimate = { opacity: 1, scale: 1, y: 0 };
const messageTransition = { type: 'spring' as const, stiffness: 300, damping: 24 };
const willChangeStyle = { willChange: 'transform, opacity' } as const;

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layout="position"
      initial={shouldReduceMotion || !isStreaming ? false : messageInitial}
      animate={messageAnimate}
      transition={messageTransition}
      style={shouldReduceMotion ? undefined : willChangeStyle}
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
            'before:absolute before:inset-0 before:animate-pulse before:-z-10',
        )}
      >
        <MarkdownRenderer content={message.content} isStreaming={isStreaming} />
      </div>
    </motion.div>
  );
}
