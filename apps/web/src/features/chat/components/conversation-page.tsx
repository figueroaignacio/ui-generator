'use client';

import { ChatInput } from '@/features/chat/components/chat-input';
import { ChatSkeleton } from '@/features/chat/components/chat-skeleton';
import { useArtifactStore } from '@/features/chat/store/artifact.store';
import { trpc } from '@/lib/trpc';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePendingPromptStore } from '../store/pending-prompt.store';
import { MessageList } from './message-list';

interface ConversationPageProps {
  id: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function ConversationPage({ id }: ConversationPageProps) {
  const utils = trpc.useUtils();
  const isHydratedRef = useRef(false);
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

  const isLoading = status === 'streaming' || status === 'submitted';
  const isStreaming = status === 'streaming';

  useEffect(() => {
    if (isHydratedRef.current) return;

    if (conversation && !isHydratedRef.current) {
      if (conversation.messages?.length > 0) {
        const uiMessages: UIMessage[] = conversation.messages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          parts: (msg.parts as UIMessage['parts'])?.length
            ? (msg.parts as UIMessage['parts'])
            : [{ type: 'text' as const, text: msg.content }],
        }));
        setMessages(uiMessages);
      }
      isHydratedRef.current = true;

      if (conversation.title) {
        utils.conversations.list.setData(undefined, old =>
          old?.map(c => (c.id === conversation.id ? { ...c, title: conversation.title! } : c)),
        );
      }
    }

    if (!isInitialLoading && !conversation?.messages?.length) {
      const pendingPrompt = consumePendingPrompt();
      if (pendingPrompt) {
        isHydratedRef.current = true;
        void sendAIMessage({ text: pendingPrompt });
      }
    }
  }, [
    conversation,
    isInitialLoading,
    setMessages,
    consumePendingPrompt,
    sendAIMessage,
    utils.conversations.list,
  ]);

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
          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            isArtifactOpen={isArtifactOpen}
            error={error}
          />
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
