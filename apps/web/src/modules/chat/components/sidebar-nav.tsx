"use client";

import { useSidebar } from "@/shared/store/use-sidebar";
import { Folder01Icon, Message02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export function SidebarNav() {
  const { isOpen } = useSidebar();
  const isMobile = useIsMobile();
  const openStyle = isOpen || isMobile;

  return (
    <div className={`space-y-1 ${openStyle ? "w-[266px]" : "w-[40px]"}`}>
      <button
        className={`flex items-center rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted group ${openStyle ? "w-full gap-3 px-2.5 py-2 text-sm justify-start" : "w-10 h-10 justify-center p-2"}`}>
        <HugeiconsIcon
          icon={Message02Icon}
          size={18}
          className="group-hover:text-foreground transition-colors"
        />
        {openStyle && <span>Chats</span>}
      </button>

      <button
        className={`flex items-center rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted group ${openStyle ? "w-full gap-3 px-2.5 py-2 text-sm justify-start" : "w-10 h-10 justify-center p-2"}`}>
        <HugeiconsIcon
          icon={Folder01Icon}
          size={18}
          className="group-hover:text-foreground transition-colors"
        />
        {openStyle && <span>Projects</span>}
      </button>
    </div>
  );
}
