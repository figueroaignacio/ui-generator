"use client";

import { LoginDialog } from "@/modules/landing/components/login-dialog";
import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const PLACEHOLDER_LINES = ["Generate a table component with sorting...", ""];

export function HeroPromptBox() {
  return (
    <LoginDialog>
      <div
        role="button"
        tabIndex={0}
        className="group w-full max-w-[720px] mx-auto cursor-pointer rounded-2xl border border-border/60 bg-card backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-lg hover:shadow-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
        <div className="relative flex flex-col p-4 min-h-[100px]">
          <span className="text-muted-foreground/50 text-base leading-relaxed select-none pointer-events-none">
            {PLACEHOLDER_LINES[0]}
          </span>
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-full bg-secondary/60 text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground/70">
              <HugeiconsIcon icon={ArrowUp02Icon} />
            </div>
          </div>
        </div>
      </div>
    </LoginDialog>
  );
}
