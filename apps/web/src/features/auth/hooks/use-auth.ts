import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { loginWithGoogle as apiLoginWithGoogle, logout as apiLogout, getMe } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, status, setUser, setStatus, clearAuth } = useAuthStore();

  const { data: currentUser, isLoading: isAuthLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const fullUser = await getMe();
      if (fullUser) {
        setUser(fullUser);
      } else {
        clearAuth();
      }
      return fullUser;
    },
    staleTime: Infinity,
    enabled: status === 'authenticated',
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      clearAuth();
      queryClient.setQueryData(['auth-user'], null);
      window.location.href = '/get-started';
    },
  });

  const login = useCallback(() => {
    window.location.href = `${API_URL}/api/auth/github`;
  }, []);

  const loginWithGoogle = useCallback(() => {
    apiLoginWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    setStatus('loading', 'Signing out...');
    await logoutMutation.mutateAsync();
  }, [logoutMutation, setStatus]);

  return {
    user: currentUser ?? user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || isAuthLoading || logoutMutation.isPending,
    login,
    loginWithGoogle,
    logout,
    setUser,
  };
}
