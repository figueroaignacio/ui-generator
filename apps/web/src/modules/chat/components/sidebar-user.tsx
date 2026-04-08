"use client";

import { useAuth } from "@/modules/auth/hooks/use-auth";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSidebar } from "@/shared/store/use-sidebar";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export function SidebarUser() {
  const { user } = useAuth();
  const { isOpen } = useSidebar();
  const isMobile = useIsMobile();
  const openStyle = isOpen || isMobile;

  return (
    <div className={`p-3 border-t border-border/50 flex flex-col items-center ${openStyle ? "" : "px-0"}`}>
      <button className={`flex items-center rounded-xl p-2 hover:bg-muted transition-colors cursor-pointer group ${openStyle ? "w-[266px] justify-between" : "justify-center w-10 h-10"}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-medium text-xs">
            {user?.username?.substring(0, 2).toUpperCase() || "IF"}
          </div>
          {openStyle && (
            <div className="flex flex-col items-start overflow-hidden text-left flex-1 min-w-0">
              <span className="truncate w-full text-sm font-medium text-foreground">
                {user?.username || "Ignacio Figueroa"}
              </span>
              <span className="text-[11px] text-muted-foreground">Free plan</span>
            </div>
          )}
        </div>

        {openStyle && (
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
          />
        )}
      </button>
    </div>
  );
}
