import { create } from 'zustand';
import { useUIStore } from './ui.store';

export interface ComponentData {
  name: string;
  code: string;
  description: string;
}

interface ArtifactState {
  isOpen: boolean;
  activeTab: 'preview' | 'code';
  component: ComponentData | null;
  openArtifact: (component: ComponentData) => void;
  closeArtifact: () => void;
  setActiveTab: (tab: 'preview' | 'code') => void;
}

export const useArtifactStore = create<ArtifactState>(set => ({
  isOpen: false,
  activeTab: 'preview',
  component: null,
  openArtifact: component => {
    useUIStore.getState().setSidebarOpen(false);
    set({ isOpen: true, component, activeTab: 'preview' });
  },
  closeArtifact: () => set({ isOpen: false }),
  setActiveTab: activeTab => set({ activeTab }),
}));
