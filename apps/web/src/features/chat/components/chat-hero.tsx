'use client';

import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
export interface ChatHeroProps {
  username: string;
}

export function ChatHero({ username }: ChatHeroProps) {
  const firstName = username.split(/[\s_-]/)[0];

  return (
    <div className="flex flex-col items-center md:items-start justify-center md:justify-start text-center gap-2 px-4">
      <div className="flex items-center gap-2 text-primary relative">
        <div className="relative">
          <div
            className="absolute inset-0 blur-lg bg-primary/20 rounded-full scale-150"
            aria-hidden="true"
          />
          <HugeiconsIcon icon={SparklesIcon} size={22} className="relative" />
        </div>
        <span className="text-base font-medium text-foreground">Hello, {firstName}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
        What shall we build?
      </h1>
    </div>
  );
}
