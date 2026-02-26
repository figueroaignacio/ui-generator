'use client';

import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  authDialogOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAuthDialogOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>(set => ({
  sidebarOpen: true,
  authDialogOpen: false,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: open => set({ sidebarOpen: open }),
  setAuthDialogOpen: open => set({ authDialogOpen: open }),
}));
