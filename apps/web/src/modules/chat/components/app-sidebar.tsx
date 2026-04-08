"use client";

import { useSidebar } from "@/shared/store/use-sidebar";
import { AnimatePresence, motion } from "motion/react";
import { SidebarActions } from "./sidebar-actions";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";
import { SidebarRecents } from "./sidebar-recents";
import { SidebarUser } from "./sidebar-user";

export function AppSidebar() {
  const { isOpen, setOpen } = useSidebar();

  const sidebarContent = (
    <div className="w-[290px] h-full flex flex-col">
      <SidebarHeader />
      <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar flex flex-col gap-6">
        <SidebarActions />
        <SidebarNav />
        <SidebarRecents />
      </div>
      <SidebarUser />
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-card border-r border-border text-card-foreground shadow-2xl w-[290px]">
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 290 : 64 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="hidden md:flex h-full flex-col bg-card border-r border-secondary text-card-foreground shrink-0 overflow-hidden relative z-10">
        {sidebarContent}
      </motion.aside>
    </>
  );
}
