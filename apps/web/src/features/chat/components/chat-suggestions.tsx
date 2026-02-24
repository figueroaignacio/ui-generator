'use client';

import {
  ArrowRight01Icon,
  Bug01Icon,
  GitBranchIcon,
  HelpCircleIcon,
  MagicWand01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';

const SUGGESTIONS = [
  {
    label: 'Build an animated button with variants',
    icon: MagicWand01Icon,
    color: '#a78bfa', // violet
  },
  {
    label: 'When should I use use()?',
    icon: HelpCircleIcon,
    color: '#38bdf8', // sky
  },
  {
    label: 'How does React compiler work?',
    icon: GitBranchIcon,
    color: '#34d399', // emerald
  },
  {
    label: 'Zustand vs Redux, which one?',
    icon: ArrowRight01Icon,
    color: '#fb923c', // orange
  },
  {
    label: 'Why is my react code not working?',
    icon: Bug01Icon,
    color: '#f87171', // red
  },
];

interface ChatSuggestionsProps {
  onSelect: (text: string) => void;
}

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <motion.div
      className="flex flex-wrap gap-2 justify-center px-4 max-w-4xl"
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
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs md:text-sm text-foreground hover:bg-accent hover:border-primary/30 transition-colors"
        >
          <HugeiconsIcon
            icon={s.icon}
            size={15}
            color={s.color}
            strokeWidth={1.5}
            className="shrink-0"
          />
          {s.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
