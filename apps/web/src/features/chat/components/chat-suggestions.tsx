'use client';

import {
  ArrowRight01Icon,
  Bug01Icon,
  GitBranchIcon,
  HelpCircleIcon,
  MagicWand01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const SUGGESTIONS = [
  {
    label: 'Build an animated button with variants',
    icon: MagicWand01Icon,
    color: '#a78bfa',
  },
  {
    label: 'When should I use use()?',
    icon: HelpCircleIcon,
    color: '#38bdf8',
  },
  {
    label: 'How does React compiler work?',
    icon: GitBranchIcon,
    color: '#34d399',
  },
  {
    label: 'Zustand vs Redux, which one?',
    icon: ArrowRight01Icon,
    color: '#fb923c',
  },
  {
    label: 'Why is my react code not working?',
    icon: Bug01Icon,
    color: '#f87171',
  },
];

export interface ChatSuggestionsProps {
  onSelect: (text: string) => void;
}

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 max-w-4xl">
      {SUGGESTIONS.map(s => (
        <button
          key={s.label}
          onClick={() => onSelect(s.label)}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs md:text-sm text-foreground hover:bg-accent hover:scale-[1.04] active:scale-[0.96] transition-transform"
        >
          <HugeiconsIcon
            icon={s.icon}
            size={15}
            color={s.color}
            strokeWidth={1.5}
            className="shrink-0"
          />
          {s.label}
        </button>
      ))}
    </div>
  );
}
