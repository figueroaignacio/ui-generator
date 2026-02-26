'use client';

import { motion } from 'motion/react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const SKELETON_ITEMS = Array.from({ length: 4 });

export function ChatSkeleton() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 px-4 py-8 max-w-3xl mx-auto w-full"
    >
      {SKELETON_ITEMS.map((_, i) => (
        <motion.div
          key={i}
          variants={item}
          className={`flex gap-4 items-start ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <div className="h-9 w-9 rounded-full bg-secondary shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-foreground/5 to-transparent animate-shimmer -translate-x-full" />
          </div>
          <div
            className={`flex flex-col gap-2.5 max-w-[80%] ${i % 2 === 0 ? 'items-start' : 'items-end'}`}
          >
            <div
              className={`h-12 rounded-2xl bg-secondary relative overflow-hidden ${
                i % 2 === 0 ? 'rounded-tl-sm w-64' : 'rounded-tr-sm w-48'
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-foreground/5 to-transparent animate-shimmer -translate-x-full" />
            </div>
            {i % 3 === 0 && (
              <div className="h-20 rounded-2xl bg-secondary/60 relative overflow-hidden w-[320px] max-w-full">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-foreground/5 to-transparent animate-shimmer -translate-x-full" />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
