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
import { cn } from '@repo/ui/lib/cn';
import Image from 'next/image';

interface SidebarUserProps {
  collapsed: boolean;
}

export function SidebarUser({ collapsed }: SidebarUserProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.username
    .split(/[\s_-]/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="shrink-0 border-t border-border/50 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-2.5 w-full rounded-lg px-2 py-2 text-sm',
              'hover:bg-accent transition-colors',
              collapsed && 'justify-center px-0',
            )}
            aria-label="User menu"
          >
            <div className="relative h-7 w-7 shrink-0 rounded-full overflow-hidden bg-muted">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.username}
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                  {initials}
                </span>
              )}
            </div>
            {!collapsed && (
              <span className="truncate text-sm font-medium text-foreground leading-none">
                {user.username}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={8} className="w-56">
          <DropdownLabel>{user.email ?? user.username}</DropdownLabel>
          <DropdownSeparator />
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={Settings01Icon}
              size={15}
              className="mr-2.5 text-muted-foreground shrink-0"
            />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={HelpCircleIcon}
              size={15}
              className="mr-2.5 text-muted-foreground shrink-0"
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
    </div>
  );
}
