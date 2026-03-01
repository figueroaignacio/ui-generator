'use client';

import { Cancel01Icon, SentIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  onStop?: () => void;
  placeholder?: string;
}

const buttonVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

const springTransition = { type: 'spring' as const, stiffness: 400, damping: 17 };
const textareaMaxHeight = { maxHeight: '200px' };

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  onStop,
  placeholder = 'Ask NachAI to generate a component…',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldReduceMotion = useReducedMotion();

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
        style={textareaMaxHeight}
        disabled={isLoading}
        aria-label="Message input"
      />
      <div className="flex items-center justify-end px-3 pb-3 pt-1">
        {isLoading ? (
          <motion.button
            key="stop"
            initial={shouldReduceMotion ? undefined : buttonVariants.initial}
            animate={buttonVariants.animate}
            exit={shouldReduceMotion ? undefined : buttonVariants.exit}
            transition={springTransition}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
            onClick={onStop}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/80 transition-colors"
            aria-label="Stop generation"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </motion.button>
        ) : (
          <motion.button
            key="send"
            initial={shouldReduceMotion ? undefined : buttonVariants.initial}
            animate={buttonVariants.animate}
            exit={shouldReduceMotion ? undefined : buttonVariants.exit}
            transition={springTransition}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            onClick={onSubmit}
            disabled={!canSubmit}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-all',
              canSubmit
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
            aria-label="Send message"
          >
            <HugeiconsIcon icon={SentIcon} size={15} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
