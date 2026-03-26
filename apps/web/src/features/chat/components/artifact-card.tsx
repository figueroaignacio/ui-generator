import { type ComponentData } from '@/features/chat/store/artifact.store';
import { type SafePart } from '@/features/chat/types';
import { CodeCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { memo } from 'react';

interface ArtifactCardProps {
  invocation: Extract<SafePart, { type: 'tool-invocation' }>['toolInvocation'] | Partial<SafePart>;
  isStreaming: boolean;
  onOpen: (data: ComponentData) => void;
}

export const ArtifactCard = memo(({ invocation, isStreaming, onOpen }: ArtifactCardProps) => {
  if (!invocation) return null;

  const component =
    'result' in invocation && invocation.result
      ? (invocation.result as Record<string, unknown>)
      : ((invocation.args || (invocation as SafePart).input || {}) as Record<string, unknown>);

  const isGenerating = !('result' in invocation) && invocation.state !== 'result' && isStreaming;

  if (isGenerating && !component.name) {
    return (
      <div className="flex items-center gap-3 w-full max-w-sm p-4 rounded-xl border border-border bg-card animate-pulse mt-2">
        <div className="h-10 w-10 rounded bg-primary/10" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!isGenerating && (!component || !component.name || !component.code)) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (component.code) onOpen(component as unknown as ComponentData);
      }}
      disabled={isGenerating}
      aria-label={`Preview ${component.name || 'component'}`}
      className={cn(
        'group flex w-full max-w-sm flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 transition-all focus-ring text-left mt-2',
        isGenerating
          ? 'opacity-70 cursor-wait'
          : 'hover:border-primary/50 hover:shadow-lg cursor-pointer glass-card',
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex shrink-0 items-center justify-center rounded-md bg-primary/10 p-2 text-primary group-hover:bg-primary/20 transition-colors">
          <HugeiconsIcon
            icon={CodeCircleIcon}
            size={20}
            className={cn(isGenerating && 'animate-spin')}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="font-heading font-semibold text-foreground truncate">
            {String(component.name || 'Artifact')}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {isGenerating ? 'Generating component...' : 'Click to preview'}
          </p>
        </div>
      </div>
    </button>
  );
});

ArtifactCard.displayName = 'ArtifactCard';
