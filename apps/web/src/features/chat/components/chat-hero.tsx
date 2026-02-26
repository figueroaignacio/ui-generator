'use client';

import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';

export interface ChatHeroProps {
  username: string;
}

const containerVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: 'easeOut' as const },
};

export function ChatHero({ username }: ChatHeroProps) {
  const firstName = username.split(/[\s_-]/)[0];

  return (
    <motion.div
      className="flex flex-col items-center md:items-start justify-center md:justify-start text-center gap-2 px-4"
      initial={containerVariants.initial}
      animate={containerVariants.animate}
      exit={containerVariants.exit}
      transition={containerVariants.transition}
    >
      <div className="flex items-center gap-2 text-primary">
        <HugeiconsIcon icon={SparklesIcon} size={22} />
        <span className="text-base font-medium text-foreground">Hello, {firstName}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
        What shall we build?
      </h1>
    </motion.div>
  );
}
