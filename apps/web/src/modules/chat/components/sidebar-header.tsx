import { Logo } from "@/shared/components/logo";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useSidebar } from "@/shared/store/use-sidebar";
import { PanelLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function SidebarHeader() {
  const { toggle, isOpen } = useSidebar();
  const isMobile = useIsMobile();
  const openStyle = isOpen || isMobile;

  return (
    <div
      className={`flex h-14 items-center px-4 ${openStyle ? "justify-between w-[290px]" : "justify-center w-[64px]"}`}>
      {openStyle && <Logo className="h-6 w-6" />}
      <button
        onClick={toggle}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1.5 rounded-md hover:bg-muted"
        aria-label="Toggle sidebar">
        <HugeiconsIcon icon={PanelLeftIcon} size={20} />
      </button>
    </div>
  );
}
