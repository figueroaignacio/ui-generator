"use client";

import { fetchMe } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuth() {
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const user = query.data ?? null;

  useEffect(() => {
    if (!query.isLoading) {
      setUser(user);
    }
  }, [user, query.isLoading, setUser]);

  return {
    user,
    isLoading: query.isLoading,
    isAuthenticated: !!user,
  };
}
