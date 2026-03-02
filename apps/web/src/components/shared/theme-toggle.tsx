'use client';

import { LaptopIcon, Moon02Icon, SunIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { useTheme } from 'nach-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: SunIcon, label: 'Light' },
    { value: 'dark' as const, icon: Moon02Icon, label: 'Dark' },
    { value: 'system' as const, icon: LaptopIcon, label: 'System' },
  ] as const;

  return (
    <div className="border-border/50 bg-muted/50 relative z-10 inline-flex items-center rounded-full border p-1 shadow-sm backdrop-blur-xl">
      {themes.map(t => {
        const isActive = theme === t.value;

        return (
          <button
            key={t.value}
            type="button"
            onClick={e => setTheme(t.value, e)}
            className={`hover:text-foreground relative flex items-center justify-center rounded-full p-2 text-sm font-medium transition-colors ${
              isActive ? 'text-foreground' : 'text-muted-foreground'
            }`}
            aria-label={`Switch to ${t.label} theme`}
            title={t.label}
          >
            {isActive && (
              <motion.div
                layoutId="theme-bubble-nextjs"
                className="bg-muted/20 absolute inset-0 rounded-full shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <HugeiconsIcon icon={t.icon} size={14} />
          </button>
        );
      })}
    </div>
  );
}
