'use client';

import { useArtifactStore, type ComponentData } from '@/features/chat/store/artifact.store';
import type { UIMessage } from '@ai-sdk/react'; // Changed from Message to UIMessage
import { CodeCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Callout } from '@repo/ui/components/callout';
import { cn } from '@repo/ui/lib/cn';
import { MarkdownRenderer } from './markdown-renderer';

interface ChatMessageProps {
  message: UIMessage; // Changed from Message to UIMessage
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const openArtifact = useArtifactStore(s => s.openArtifact); // Changed from setComponent to openArtifact

  return (
    <div className={cn('flex gap-3 w-full items-start', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-full rounded-2xl text-sm leading-relaxed relative transition-all duration-300',
          isUser
            ? 'bg-card rounded-tr-sm px-4 py-2.5 shadow-sm ring-1 ring-border/50 w-fit'
            : 'text-foreground px-0 w-full',
        )}
      >
        <div className="flex flex-col gap-4">
          {message.parts.map((item: unknown, index: number) => {
            const part = item as { type: string; [key: string]: unknown };
            if (part.type === 'text') {
              const text = (part.text as string) || '';
              if (!text.trim()) return null;

              const isLastPart = index === message.parts.length - 1;
              return (
                <MarkdownRenderer
                  key={`${message.id}-text-${index}`}
                  content={text}
                  isStreaming={isStreaming && isLastPart}
                />
              );
            }

            interface SafePart {
              type: string;
              toolInvocation?: {
                toolName: string;
                args: unknown;
                input?: unknown;
                result?: unknown;
                state: string;
                toolCallId: string;
              };
              args?: unknown;
              input?: unknown;
              result?: unknown;
              state?: string;
              toolCallId?: string;
              error?: unknown;
            }

            const partObj = part as unknown as SafePart;
            if (partObj.type === 'tool-invocation' || partObj.type?.startsWith('tool-')) {
              const toolName =
                partObj.type === 'tool-invocation'
                  ? partObj.toolInvocation?.toolName
                  : partObj.type.replace('tool-', '');

              if (toolName === 'generateComponent') {
                const invocation =
                  partObj.type === 'tool-invocation' ? partObj.toolInvocation : partObj;

                if (!invocation) return null;

                const component =
                  'result' in invocation && invocation.result
                    ? (invocation.result as Record<string, unknown>)
                    : ((invocation.args || invocation.input || {}) as Record<string, unknown>);

                const isGenerating =
                  (!('result' in invocation) && invocation.state !== 'result') && isStreaming;

                if (isGenerating && !component.name) {
                  return (
                    <div
                      key={String(invocation.toolCallId)}
                      className="flex items-center gap-3 w-full max-w-sm p-4 rounded-xl border border-border bg-card animate-pulse mt-2"
                    >
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
                    key={String(invocation.toolCallId)}
                    type="button"
                    onClick={() => {
                      if (component.code) openArtifact(component as unknown as ComponentData);
                    }}
                    disabled={isGenerating}
                    className={cn(
                      'group flex w-full max-w-sm flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 transition-all focus-ring text-left mt-2',
                      isGenerating
                        ? 'opacity-70 cursor-wait'
                        : 'hover:border-primary/50 hover:shadow-md cursor-pointer glow-hover glow-primary',
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex shrink-0 items-center justify-center rounded-md bg-primary/10 p-2 text-primary">
                        <HugeiconsIcon
                          icon={CodeCircleIcon}
                          size={20}
                          className={cn(isGenerating && 'animate-spin')}
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-heading font-semibold text-foreground truncate">
                          {String(component.name)}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {isGenerating ? 'Generating component...' : 'Click to preview'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              }
            }

            if (partObj.type === 'error') {
              const error = partObj.error;
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : typeof error === 'string'
                    ? error
                    : 'An error occurred during generation. Please try again.';

              return (
                <Callout
                  key={`${message.id}-error-${index}`}
                  variant="danger"
                  title="An error has occurred"
                  className="mt-2 w-full"
                >
                  {errorMessage}
                </Callout>
              );
            }

            return null;
          })}

          {/* Standard toolInvocations are already handled within the parts loop for custom UI streams */}
        </div>
      </div>
    </div>
  );
}
