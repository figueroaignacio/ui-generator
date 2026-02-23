'use client';

import { BackButton } from '@/components/shared/back-button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Calendar01Icon, Location01Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: IconSvgElement;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <HugeiconsIcon icon={icon} size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm text-foreground wrap-break-word">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.username
    .split(/[\s_-]/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <div className="ml-4 mt-2">
        <BackButton />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="max-w-2xl w-full mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-8">
            <div className="relative shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="size-24 rounded-2xl object-cover ring-2 ring-border"
                />
              ) : (
                <span className="flex size-24 items-center justify-center rounded-2xl bg-muted text-2xl font-bold text-muted-foreground ring-2 ring-border">
                  {initials}
                </span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {user.username}
              </h1>
              {user.email && <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Profile info
            </h2>
            <InfoRow icon={UserIcon} label="Username" value={user.username} />
            <InfoRow icon={UserIcon} label="Bio" value={user.bio} />
            <InfoRow icon={Location01Icon} label="Location" value={user.location} />
            <InfoRow icon={Calendar01Icon} label="Member since" value={joinedDate} />
          </div>
        </div>
      </div>
    </>
  );
}
