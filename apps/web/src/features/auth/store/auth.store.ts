import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStatus, User } from '../types';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      status: 'loading',

      setUser: user =>
        set({
          user,
          status: user ? 'authenticated' : 'unauthenticated',
        }),

      setStatus: status => set({ status }),

      clearAuth: () =>
        set({
          user: null,
          status: 'unauthenticated',
        }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.status = state.user ? 'authenticated' : 'unauthenticated';
        }
      },
    },
  ),
);
