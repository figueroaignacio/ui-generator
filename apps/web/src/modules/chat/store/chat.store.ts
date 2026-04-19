import { create } from "zustand";

interface ChatStore {
  pendingMessage: string | null;
  setPendingMessage: (message: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  pendingMessage: null,
  setPendingMessage: (message) => set({ pendingMessage: message }),
}));
