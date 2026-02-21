'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { HelpCircleIcon, Logout01Icon, Settings01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DropdownLabel,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownSeparator,
} from '@repo/ui/components/dropdown-menu';
import Image from 'next/image';

export function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.username
    .split(/[\s_-]/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2 ring-border hover:ring-primary/50 transition-all focus:outline-none"
          aria-label="User menu"
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.username}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {initials}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-56">
        <DropdownLabel>{user.email ?? user.username}</DropdownLabel>
        <DropdownSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon
            icon={Settings01Icon}
            size={15}
            className="mr-2.5 shrink-0 text-muted-foreground"
          />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HugeiconsIcon
            icon={HelpCircleIcon}
            size={15}
            className="mr-2.5 shrink-0 text-muted-foreground"
          />
          Help
        </DropdownMenuItem>
        <DropdownSeparator />
        <DropdownMenuItem variant="destructive" onSelect={logout}>
          <HugeiconsIcon icon={Logout01Icon} size={15} className="mr-2.5 shrink-0" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
