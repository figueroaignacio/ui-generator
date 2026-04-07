"use client";

import { HeroActionPills } from "./hero-action-pills";
import { HeroHeading } from "./hero-heading";
import { HeroPromptBox } from "./hero-prompt-box";

export function HeroSection() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8">
        <HeroHeading />
        <HeroPromptBox />
        <HeroActionPills />
      </div>
    </section>
  );
}
