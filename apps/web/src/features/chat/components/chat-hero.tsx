'use client';

import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion, useReducedMotion } from 'motion/react';

export interface ChatHeroProps {
  username: string;
}

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
  exit: { opacity: 0, y: -8 },
};

const childVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 24 };

export function ChatHero({ username }: ChatHeroProps) {
  const firstName = username.split(/[\s_-]/)[0];
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center md:items-start justify-center md:justify-start text-center gap-2 px-4"
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="flex items-center gap-2 text-primary relative"
        variants={shouldReduceMotion ? undefined : childVariants}
        transition={springTransition}
      >
        <div className="relative">
          <div
            className="absolute inset-0 blur-lg bg-primary/20 rounded-full scale-150"
            aria-hidden="true"
          />
          <HugeiconsIcon icon={SparklesIcon} size={22} className="relative" />
        </div>
        <span className="text-base font-medium text-foreground">Hello, {firstName}</span>
      </motion.div>
      <motion.h1
        className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight"
        variants={shouldReduceMotion ? undefined : childVariants}
        transition={springTransition}
      >
        What shall we build?
      </motion.h1>
    </motion.div>
  );
}
