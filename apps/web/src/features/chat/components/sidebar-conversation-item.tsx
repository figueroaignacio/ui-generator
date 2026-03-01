'use client';

import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { cn } from '@repo/ui/lib/cn';
import Link from 'next/link';
import { Conversation } from '../types';

interface SidebarConversationItemProps {
  chat: Conversation;
  isActive: boolean;
  onAction?: () => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function SidebarConversationItem({
  chat,
  isActive,
  onAction,
  onDelete,
  isDeleting,
}: SidebarConversationItemProps) {
  const href = `/chat/c/${chat.id}`;

  return (
    <div className="group relative">
      <Link
        href={href}
        onClick={onAction}
        className={cn(
          'flex items-center gap-2.5 w-full rounded-lg px-2 py-2 pr-10 text-sm transition-colors text-left',
          isActive
            ? 'bg-card text-foreground font-medium'
            : 'text-muted-foreground hover:bg-card hover:text-foreground',
        )}
      >
        <span className="truncate">{chat.title ?? 'Thinking in a title...'}</span>
      </Link>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-destructive transition-colors touch-manipulation"
              title="Delete conversation"
              onClick={e => e.stopPropagation()}
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete conversation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  &quot;{chat.title ?? 'this conversation'}&quot;
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(chat.id)}
                loading={isDeleting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
