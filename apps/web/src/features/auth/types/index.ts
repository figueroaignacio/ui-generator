export interface User {
  id: string;
  username: string;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  profileUrl: string | null;
  createdAt: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
