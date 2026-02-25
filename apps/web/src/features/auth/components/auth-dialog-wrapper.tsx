'use client';

import { useUIStore } from '@/features/chat/store/ui.store';
import { LoginDialog } from './login-dialog';

export function AuthDialogWrapper() {
  const { authDialogOpen, setAuthDialogOpen } = useUIStore();

  return <LoginDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />;
}
