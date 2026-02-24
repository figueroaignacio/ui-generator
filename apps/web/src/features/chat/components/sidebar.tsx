'use client';

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { useState } from 'react';
import { SidebarHeader } from './sidebar-header';
import { SidebarHistory } from './sidebar-history';
import { SidebarNav } from './sidebar-nav';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out shrink-0',
          collapsed ? 'w-14' : 'w-80',
        )}
      >
        <SidebarHeader collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <SidebarNav collapsed={collapsed} />
          {!collapsed && <SidebarHistory />}
        </div>
      </aside>
      <MobileSidebar />
    </>
  );
}

function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary transition-colors"
        aria-label="Open sidebar"
      >
        <HugeiconsIcon icon={PanelLeftCloseIcon} size={18} />
      </button>
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-xs"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={cn(
          'md:hidden fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-3 py-3">
          <span className="font-heading font-semibold text-sm">NachAI</span>
          <button
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
            aria-label="Close sidebar"
          >
            <HugeiconsIcon icon={PanelLeftOpenIcon} size={16} />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <SidebarNav collapsed={false} />
          <SidebarHistory />
        </div>
      </aside>
    </>
  );
}
