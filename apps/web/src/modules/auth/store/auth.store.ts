import { create } from "zustand";

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
