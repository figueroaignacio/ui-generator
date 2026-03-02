'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { addMessage, createConversation } from '../api/conversations.api';
import type { Conversation } from '../types';
import { ChatHero } from './chat-hero';
import { ChatInput } from './chat-input';
import { ChatMessage, type Message } from './chat-message';
import { ChatSuggestions } from './chat-suggestions';

export function ChatPage() {
  const { user } = useAuth();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messages: Message[] = localMessages;
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const isHero = messages.length === 0;

  const startChatMutation = useMutation({
    mutationFn: async (content: string) => {
      const conversation = await createConversation();
      queryClient.setQueryData<Conversation[]>(['conversations'], old =>
        old ? [conversation, ...old] : [conversation],
      );

      queryClient.setQueryData(['conversation', conversation.id], {
        ...conversation,
        messages: [
          { id: 'temp-draft', role: 'user', content, createdAt: new Date().toISOString() },
        ],
      });

      await addMessage(conversation.id, 'user', content);

      return conversation;
    },
    onSuccess: conversation => {
      router.push(`/chat/c/${conversation.id}`);
    },
    onError: () => {
      setIsThinking(false);
    },
  });

  const showThinking = isThinking || startChatMutation.isPending;

  useEffect(() => {
    if (messages.length > 0 || showThinking) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, showThinking]);

  const handleSubmit = useCallback(async () => {
    const content = input.trim();
    if (!content || startChatMutation.isPending) return;

    setInput('');
    setIsThinking(true);
    setLocalMessages([
      {
        id: 'temp',
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
        conversationId: 'temp',
      } as Message,
    ]);
    startChatMutation.mutate(content);
  }, [input, startChatMutation]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {isHero ? (
          <div className="flex flex-col items-center justify-center h-full gap-8 py-16 px-4">
            {user && <ChatHero username={user.username} />}
            <div className="w-full max-w-2xl">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                isLoading={startChatMutation.isPending}
              />
            </div>
            <ChatSuggestions onSelect={setInput} />
          </div>
        ) : (
          <div className="flex flex-col gap-6 px-4 py-6 max-w-3xl mx-auto w-full">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {showThinking && (
              <ChatMessage
                message={{ id: 'thinking', role: 'assistant', content: '' }}
                isThinking={true}
              />
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>
      {!isHero && (
        <div className="shrink-0 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={showThinking}
              onStop={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
