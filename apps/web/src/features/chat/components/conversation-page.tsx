'use client';

import { ChatInput } from '@/features/chat/components/chat-input';
import { ChatMessage } from '@/features/chat/components/chat-message';
import { ChatSkeleton } from '@/features/chat/components/chat-skeleton';
import { useArtifactStore } from '@/features/chat/store/artifact.store';
import { trpc } from '@/lib/trpc';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { Callout } from '@repo/ui/components/callout';
import { DefaultChatTransport } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePendingPromptStore } from '../store/pending-prompt.store';

interface ConversationPageProps {
  id: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function ConversationPage({ id }: ConversationPageProps) {
  const utils = trpc.useUtils();
  const hasLoadedRef = useRef(false);
  const hasInitialSentRef = useRef(false);
  const consumePendingPrompt = usePendingPromptStore(s => s.consumePendingPrompt);
  const isArtifactOpen = useArtifactStore(s => s.isOpen);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${API_URL}/api/conversations/${id}/stream`,
        credentials: 'include',
      }),
    [id],
  );

  const {
    messages,
    error,
    status,
    sendMessage: sendAIMessage,
    setMessages,
    stop,
  } = useChat({
    id,
    transport,
    onFinish: () => {
      utils.conversations.list.invalidate();
    },
  });

  const { data: conversation, isLoading: isInitialLoading } = trpc.conversations.get.useQuery(
    { id },
    { enabled: !!id },
  );

  const [input, setInput] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';
  const isStreaming = status === 'streaming';

  useEffect(() => {
    const pendingPrompt = consumePendingPrompt();
    if (pendingPrompt && !hasInitialSentRef.current) {
      hasInitialSentRef.current = true;
      sendAIMessage({ text: pendingPrompt });
    }

    if (!conversation) return;

    if (conversation.title) {
      utils.conversations.list.setData(undefined, old =>
        old?.map(c => (c.id === conversation.id ? { ...c, title: conversation.title! } : c)),
      );
    }

    if (conversation.messages?.length > 0 && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      const uiMessages = conversation.messages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        parts: msg.parts?.length
          ? (msg.parts as UIMessage['parts'])
          : [{ type: 'text' as const, text: msg.content }],
      }));

      setMessages(uiMessages);
    }
  }, [conversation, setMessages, consumePendingPrompt, sendAIMessage, utils.conversations.list]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: isStreaming ? 'auto' : 'smooth',
    });
  }, [messages, isStreaming]);

  const handleSubmit = async () => {
    const content = input.trim();
    if (!content || isLoading) return;
    setInput('');
    await sendAIMessage({ text: content });
  };

  return (
    <div className="flex flex-col h-full transition-all duration-300">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {isInitialLoading ? (
          <ChatSkeleton key="skeleton" />
        ) : (
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
        )}
      </div>
      <div className="shrink-0 px-4 py-3">
        <div
          className={`mx-auto transition-all duration-300 ${
            isArtifactOpen ? 'max-w-4xl' : 'max-w-3xl'
          }`}
        >
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onStop={stop}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
