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

const heroInitial = { opacity: 0 };
const heroAnimate = { opacity: 1 };
const heroExit = { opacity: 0, y: -10 };
const heroTransition = { duration: 0.25 };

const chatInitial = { opacity: 0 };
const chatAnimate = { opacity: 1 };
const chatTransition = { duration: 0.2 };

const thinkingInitial = { opacity: 0 };
const thinkingAnimate = { opacity: 1 };

export function ChatPage() {
  const { user } = useAuth();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messages: Message[] = useMemo(() => localMessages, [localMessages]);
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

      // Pre-seed the conversation cache to avoid loading skeletons on redirect
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
  });

  const handleSubmit = useCallback(async () => {
    const content = input.trim();
    if (!content || startChatMutation.isPending) return;

    setInput('');
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
        <AnimatePresence mode="wait">
          {isHero ? (
            <motion.div
              key="hero"
              className="flex flex-col items-center justify-center h-full gap-8 py-16 px-4"
              initial={heroInitial}
              animate={heroAnimate}
              exit={heroExit}
              transition={heroTransition}
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
              initial={chatInitial}
              animate={chatAnimate}
              transition={chatTransition}
            >
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {startChatMutation.isPending && (
                <motion.div
                  initial={thinkingInitial}
                  animate={thinkingAnimate}
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
