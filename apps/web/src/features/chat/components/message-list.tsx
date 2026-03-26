import { type UIMessage } from '@ai-sdk/react';
import { Callout } from '@repo/ui/components/callout';
import { memo, useRef } from 'react';
import { ChatMessage } from './chat-message';

interface MessageListProps {
  messages: UIMessage[];
  isStreaming: boolean;
  isArtifactOpen: boolean;
  error?: Error | null;
}

export const MessageList = memo(({ messages, isStreaming, isArtifactOpen, error }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`flex flex-col gap-6 px-4 py-6 mx-auto w-full transition-all duration-300 ${
        isArtifactOpen ? 'max-w-4xl' : 'max-w-3xl'
      }`}
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.map((msg, i) => {
        const isMsgStreaming = isStreaming && i === messages.length - 1;
        return <ChatMessage key={msg.id} message={msg} isStreaming={isMsgStreaming} />;
      })}

      {error && (
        <Callout variant="danger" title="An error has occurred" className="w-full mt-4">
          {error.message ||
            'An unexpected error occurred. Please try again or check your quota.'}
        </Callout>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
});

MessageList.displayName = 'MessageList';
