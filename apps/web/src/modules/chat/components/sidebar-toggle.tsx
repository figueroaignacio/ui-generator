"use client";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useSidebar } from "@/shared/store/use-sidebar";
import { PanelLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function SidebarToggle() {
  const { toggle } = useSidebar();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="absolute top-4 left-4 z-40">
      <button
        onClick={toggle}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1.5 rounded-md hover:bg-muted"
        aria-label="Toggle sidebar">
        <HugeiconsIcon icon={PanelLeftIcon} size={20} />
      </button>
    </div>
  );
}
