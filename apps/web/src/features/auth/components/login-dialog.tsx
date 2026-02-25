'use client';

import { Dialog, DialogContent } from '@repo/ui/components/dialog';
import { LoginCardInner } from './login-card';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
        <div className="bg-background rounded-3xl p-8 border shadow-2xl">
          <LoginCardInner showHeader={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
