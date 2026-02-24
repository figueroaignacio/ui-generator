'use client';

import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';

export default function SearchPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 rounded-full bg-secondary">
          <HugeiconsIcon icon={Search01Icon} size={32} className="text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-heading font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground max-w-sm">
          Search functionality is coming soon. You'll be able to find previous conversations and
          specific messages here.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-1 rounded-2xl border border-border bg-secondary/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
      >
        <div className="flex items-center gap-2 px-3">
          <HugeiconsIcon icon={Search01Icon} size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full h-11 bg-transparent text-sm focus:outline-none"
            autoFocus
          />
        </div>
      </motion.div>
    </div>
  );
}
