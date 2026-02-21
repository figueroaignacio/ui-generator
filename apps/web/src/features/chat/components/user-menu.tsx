'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { HelpCircleIcon, Logout01Icon, Settings01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownSeparator,
} from '@repo/ui/components/dropdown-menu';

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
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="rounded-full object-cover size-8"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {initials}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-72 rounded-xl">
        <div className="px-2 py-1.5 text-sm font-medium leading-none">
          <div className="flex items-center gap-2">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="rounded-full object-cover size-8"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {initials}
              </span>
            )}
            <div className="flex flex-col">
              {user.username}
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </div>
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
