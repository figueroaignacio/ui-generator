'use client';

import { useUIStore } from '@/features/chat/store/ui.store';
import { cn } from '@repo/ui/lib/cn';
import { useCallback } from 'react';
import { SidebarHeader } from './sidebar-header';
import { SidebarHistory } from './sidebar-history';
import { SidebarNav } from './sidebar-nav';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen bg-secondary border-r border-border transition-all duration-300 ease-in-out shrink-0',
          !sidebarOpen ? 'w-14' : 'w-80',
        )}
      >
        <SidebarHeader collapsed={!sidebarOpen} onToggle={toggleSidebar} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <SidebarNav collapsed={!sidebarOpen} />
          {sidebarOpen && <SidebarHistory />}
        </div>
      </aside>
      <MobileSidebar />
    </>
  );
}

function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const handleClose = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-xs"
          onClick={handleClose}
        />
      )}
      <aside
        className={cn(
          'md:hidden fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-secondary border-r border-border',
          'transition-transform duration-300 ease-in-out shadow-2xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarHeader collapsed={false} onToggle={handleClose} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <SidebarNav collapsed={false} onAction={handleClose} />
          <SidebarHistory onAction={handleClose} />
        </div>
      </aside>
    </>
  );
}
