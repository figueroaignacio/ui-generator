'use client';

import { useCallback, useEffect } from 'react';
import { logout as apiLogout, getMe } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function useAuth() {
  const { user, status, setUser, setStatus, clearAuth } = useAuthStore();

  useEffect(() => {
    // Only refresh when the store already thinks the user is authenticated
    // (hydrated from localStorage). No status flip to 'loading' — avoids
    // infinite spinner when multiple components use this hook.
    if (status === 'authenticated') {
      getMe().then(fullUser => {
        if (fullUser) {
          setUser(fullUser);
        } else {
          clearAuth();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(() => {
    window.location.href = `${API_URL}/api/auth/github`;
  }, []);

  const logout = useCallback(async () => {
    setStatus('loading', 'Signing out...');
    await apiLogout();
    clearAuth();
    window.location.href = '/';
  }, [clearAuth, setStatus]);

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login,
    logout,
    setUser,
  };
}
