'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addMessage, createConversation } from '../api/conversations.api';
import type { Conversation } from '../types';
import { ChatHero } from './chat-hero';
import { ChatInput } from './chat-input';
import { ChatMessage, type Message } from './chat-message';
import { ChatSuggestions } from './chat-suggestions';

export function ChatPage() {
  const { user } = useAuth();
  const messages: Message[] = useMemo(() => [], []);
  const [input, setInput] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const isHero = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChatMutation = useMutation({
    mutationFn: async (content: string) => {
      const conversation = await createConversation();
      queryClient.setQueryData<Conversation[]>(['conversations'], old =>
        old ? [conversation, ...old] : [conversation],
      );
      await addMessage(conversation.id, 'user', content);

      return conversation;
    },
    onSuccess: conversation => {
      router.push(`/chat/c/${conversation.id}`);
    },
  });

  const handleSubmit = useCallback(async () => {
    const content = input.trim();
    if (!content || startChatMutation.isPending) return;

    setInput('');
    startChatMutation.mutate(content);
  }, [input, startChatMutation]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isHero ? (
            <motion.div
              key="hero"
              className="flex flex-col items-center justify-center h-full gap-8 py-16 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
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
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              className="flex flex-col gap-6 px-4 py-6 max-w-3xl mx-auto w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {messages.map(msg => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  avatarUrl={user?.avatarUrl ?? undefined}
                  username={user?.username}
                />
              ))}
              {startChatMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 text-muted-foreground text-sm font-medium animate-pulse py-2 px-1"
                >
                  Thinking...
                </motion.div>
              )}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!isHero && (
        <div className="shrink-0 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={startChatMutation.isPending}
              onStop={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
