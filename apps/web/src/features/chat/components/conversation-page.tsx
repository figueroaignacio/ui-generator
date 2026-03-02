'use client';

import { ChatInput } from '@/features/chat/components/chat-input';
import { ChatMessage } from '@/features/chat/components/chat-message';
import { ChatSkeleton } from '@/features/chat/components/chat-skeleton';
import { useConversation } from '@/features/chat/hooks/use-conversation';
import { useEffect, useRef, useState } from 'react';

interface ConversationPageProps {
  id: string;
}

export function ConversationPage({ id }: ConversationPageProps) {
  const { messages, isLoading, isFetching, sendMessage } = useConversation(id);
  const [input, setInput] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const streamingMsg = messages.find(m => m.id === 'streaming');
  const isThinking = isLoading && (!streamingMsg || streamingMsg.content === '');

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const behavior = streamingMsg ? 'auto' : 'smooth';

    container.scrollTo({
      top: container.scrollHeight,
      behavior: behavior,
    });
  }, [messages, isThinking, streamingMsg]);

  const handleSubmit = async () => {
    const content = input.trim();
    if (!content || isLoading) return;
    setInput('');
    await sendMessage(content);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {isFetching && messages.length === 0 ? (
          <ChatSkeleton key="skeleton" />
        ) : (
          <div
            className="flex flex-col gap-6 px-4 py-6 max-w-3xl mx-auto w-full"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map(msg => (
              <ChatMessage
                key={msg.id}
                message={{ id: msg.id, role: msg.role, content: msg.content }}
                isStreaming={msg.id === 'streaming'}
                isThinking={msg.id === 'streaming' && isThinking}
              />
            ))}

            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>
      <div className="shrink-0 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
