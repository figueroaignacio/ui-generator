"use client";

import { LoginDialog } from "@/modules/landing/components/login-dialog";
import { Button } from "@repo/ui/components/button";

const ACTIONS = [
  { label: "Generate a Layout" },
  { label: "Design a Dashboard" },
  { label: "Create a component" },
  { label: "Research" },
] as const;

export function HeroActionPills() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
      {ACTIONS.map((action) => (
        <LoginDialog key={action.label}>
          <Button type="button" variant="outline">
            {action.label}
          </Button>
        </LoginDialog>
      ))}
    </div>
  );
}
