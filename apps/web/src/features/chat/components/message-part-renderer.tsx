import { type ComponentData } from '@/features/chat/store/artifact.store';
import { type SafePart } from '@/features/chat/types';
import { Callout } from '@repo/ui/components/callout';
import { memo } from 'react';
import { ArtifactCard } from './artifact-card';
import { MarkdownRenderer } from './markdown-renderer';

interface MessagePartRendererProps {
  part: SafePart;
  messageId: string;
  index: number;
  isStreaming: boolean;
  onOpenArtifact: (data: ComponentData) => void;
}

export const MessagePartRenderer = memo(
  ({ part, messageId, index, isStreaming, onOpenArtifact }: MessagePartRendererProps) => {
    if (part.type === 'text') {
      const text = part.text || '';
      if (!text.trim()) return null;

      return (
        <MarkdownRenderer
          key={`${messageId}-text-${index}`}
          content={text}
          isStreaming={isStreaming}
        />
      );
    }

    if (part.type === 'tool-invocation' || part.type?.startsWith('tool-')) {
      const toolName =
        part.type === 'tool-invocation'
          ? part.toolInvocation?.toolName
          : part.type.replace('tool-', '');

      if (toolName === 'generateComponent') {
        const invocation = part.type === 'tool-invocation' ? part.toolInvocation : part;
        return (
          <ArtifactCard
            key={String(invocation?.toolCallId || index)}
            invocation={
              invocation as Extract<SafePart, { type: 'tool-invocation' }>['toolInvocation']
            }
            isStreaming={isStreaming}
            onOpen={onOpenArtifact}
          />
        );
      }
    }

    if (part.type === 'error') {
      const errorMessage =
        part.error instanceof Error
          ? part.error.message
          : typeof part.error === 'string'
            ? part.error
            : 'An error occurred during generation.';

      return (
        <Callout
          key={`${messageId}-error-${index}`}
          variant="danger"
          title="An error has occurred"
          className="mt-2 w-full"
        >
          {errorMessage}
        </Callout>
      );
    }

    return null;
  },
);

MessagePartRenderer.displayName = 'MessagePartRenderer';
