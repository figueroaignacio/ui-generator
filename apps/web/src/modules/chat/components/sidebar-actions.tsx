"use client";

import { PlusSignIcon, Search02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dialog } from "@repo/ui/components/dialog";
import { useSidebar } from "@/shared/store/use-sidebar";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export function SidebarActions() {
  const { isOpen } = useSidebar();
  const isMobile = useIsMobile();
  const openStyle = isOpen || isMobile;

  return (
    <div className={`space-y-1 ${openStyle ? "w-[266px]" : "w-[40px]"}`}>
      <button className={`flex items-center rounded-lg transition-colors cursor-pointer text-foreground hover:bg-muted ${openStyle ? "w-full gap-3 px-2.5 py-2 text-sm justify-start" : "w-10 h-10 justify-center p-2"}`}>
        <HugeiconsIcon icon={PlusSignIcon} size={18} />
        {openStyle && <span className="font-medium">New chat</span>}
      </button>

      <Dialog>
        <Dialog.Trigger className={`flex items-center rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted group ${openStyle ? "w-full gap-3 px-2.5 py-2 text-sm justify-start" : "w-10 h-10 justify-center p-2"}`}>
          <HugeiconsIcon
            icon={Search02Icon}
            size={18}
            className="group-hover:text-foreground transition-colors"
          />
          {openStyle && <span>Search</span>}
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Search</Dialog.Title>
            <Dialog.Description>
              Search functionality coming soon. This is a static placeholder as requested.
            </Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
