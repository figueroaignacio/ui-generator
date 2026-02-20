'use client';

import { useCallback, useEffect } from 'react';
import { logout as apiLogout, getAuthStatus } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function useAuth() {
  const { user, status, setUser, setStatus, clearAuth } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated') {
      getAuthStatus().then(({ authenticated, user: apiUser }) => {
        if (authenticated && apiUser) {
          setUser(apiUser);
        } else {
          clearAuth();
        }
      });
    } else if (status === 'unauthenticated') {
    }
  }, []);

  const login = useCallback(() => {
    window.location.href = `${API_URL}/api/auth/github`;
  }, []);

  const logout = useCallback(async () => {
    setStatus('loading');
    await apiLogout();
    clearAuth();
    window.location.href = '/login';
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
