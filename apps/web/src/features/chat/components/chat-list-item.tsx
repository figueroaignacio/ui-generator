'use client';

import { Calendar01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
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
import Link from 'next/link';
import type { Conversation } from '../types';

interface ChatListItemProps {
  chat: Conversation;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function ChatListItem({ chat, onDelete, isDeleting }: ChatListItemProps) {
  return (
    <div className="group relative flex items-center justify-between py-4 transition-colors hover:bg-muted/30 -mx-4 px-4 ">
      <Link href={`/chat/c/${chat.id}`} className="flex-1 min-w-0 pr-12">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-foreground truncate  transition-colors">
            {chat.title ?? 'Untitled Conversation'}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Calendar01Icon} size={12} />
            <span>
              {new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }).format(new Date(chat.updatedAt))}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete"
              onClick={e => e.stopPropagation()}
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete conversation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;
                <span className="font-semibold text-foreground">
                  {chat.title ?? 'this conversation'}
                </span>
                &quot;?
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
