import { AuthGuard } from '@/features/auth/components/auth-guard';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
