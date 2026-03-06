'use client';

import { Loading03Icon, SentIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { useEffect, useRef } from 'react';

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = 'Ask NachAI to generate a component…',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) onSubmit();
    }
  };

  const canSubmit = value.trim().length > 0 && !isLoading;

  return (
    <div className="w-full rounded-2xl border border-border bg-secondary shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        disabled={isLoading}
        aria-label="Message input"
      />
      <div className="flex items-center justify-end px-3 pb-3 pt-1">
        <div>
          {isLoading ? (
            <button
              type="button"
              title="Loading generation"
              disabled
              className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/80 transition-colors animate-spin"
            >
              <HugeiconsIcon icon={Loading03Icon} size={14} />
            </button>
          ) : (
            <button
              key="send"
              title="Send message"
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                canSubmit
                  ? 'bg-background hover:scale-105 active:scale-95'
                  : 'bg-muted text-muted-foreground cursor-not-allowed',
              )}
              aria-label="Send message"
            >
              <HugeiconsIcon icon={SentIcon} size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
