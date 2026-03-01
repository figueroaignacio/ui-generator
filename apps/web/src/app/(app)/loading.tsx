import { Loading02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <HugeiconsIcon
        icon={Loading02Icon}
        className="animate-spin text-muted-foreground"
        size={24}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
