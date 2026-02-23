'use client';

import { motion } from 'motion/react';

const SUGGESTIONS = [
  { label: 'Animated button with variants' },
  { label: 'Dashboard stats card' },
  { label: 'Responsive navbar' },
  { label: 'File upload dropzone' },
  { label: 'Modal dialog with form' },
];

interface ChatSuggestionsProps {
  onSelect: (text: string) => void;
}

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <motion.div
      className="flex flex-wrap gap-2 justify-center px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {SUGGESTIONS.map((s, i) => (
        <motion.button
          key={s.label}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 * i, duration: 0.2 }}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(s.label)}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-accent hover:border-primary/30 transition-colors"
        >
          {s.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
