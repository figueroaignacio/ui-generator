import { User } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function fetchWithCredentials(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res;
}

export async function getAuthStatus(): Promise<{
  authenticated: boolean;
  user: User | null;
}> {
  try {
    const res = await fetchWithCredentials('/api/auth/status');
    if (!res.ok) return { authenticated: false, user: null };
    return res.json();
  } catch {
    return { authenticated: false, user: null };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetchWithCredentials('/api/auth/logout', { method: 'POST' });
  } catch {}
}

export async function refreshTokens(): Promise<boolean> {
  try {
    const res = await fetchWithCredentials('/api/auth/refresh', { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}
