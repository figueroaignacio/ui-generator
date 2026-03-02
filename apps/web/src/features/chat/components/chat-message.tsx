'use client';

import { cn } from '@repo/ui/lib/cn';
import { MarkdownRenderer } from './markdown-renderer';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  isThinking?: boolean;
}

export function ChatMessage({ message, isStreaming, isThinking }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 w-full items-start', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-full rounded-2xl text-sm leading-relaxed relative transition-all duration-300',
          isUser
            ? 'bg-card rounded-tr-sm px-4 py-2.5 shadow-sm ring-1 ring-border/50 w-fit'
            : 'text-foreground px-0',
        )}
      >
        {isThinking ? (
          <div className="flex items-center gap-1 py-1 text-muted-foreground">
            <div className="flex items-center gap-[3px] mr-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:200ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:400ms]" />
            </div>
            <span className="text-sm font-medium animate-pulse">Thinking...</span>
          </div>
        ) : (
          <MarkdownRenderer content={message.content} isStreaming={isStreaming} />
        )}
      </div>
    </div>
  );
}
