'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
const heroExit = { opacity: 0, y: -10, transition: { duration: 0.15 } };
const heroTransition = { duration: 0.25 };

const chatInitial = { opacity: 0, y: 8 };
const chatAnimate = { opacity: 1, y: 0 };
const chatTransition = { duration: 0.25, delay: 0.1 };

const thinkingAnimate = { opacity: [0.4, 1, 0.4] };
const thinkingTransition = { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const };

export function ChatPage() {
  const { user } = useAuth();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messages: Message[] = useMemo(() => localMessages, [localMessages]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

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
    onError: () => {
      setIsThinking(false);
    },
  });

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

  const showThinking = isThinking || startChatMutation.isPending;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {isHero ? (
            <motion.div
              key="hero"
              className="flex flex-col items-center justify-center h-full gap-8 py-16 px-4"
              initial={shouldReduceMotion ? undefined : heroInitial}
              animate={heroAnimate}
              exit={shouldReduceMotion ? undefined : heroExit}
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
              initial={shouldReduceMotion ? undefined : chatInitial}
              animate={chatAnimate}
              transition={chatTransition}
            >
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {showThinking && (
                <div
                  className="flex items-center gap-2 py-2 px-1"
                  role="status"
                  aria-live="polite"
                  aria-label="Processing your message"
                >
                  <div className="flex items-center gap-1">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                    />
                  </div>
                  <motion.span
                    animate={thinkingAnimate}
                    transition={thinkingTransition}
                    className="text-muted-foreground text-sm font-medium"
                  >
                    Thinking...
                  </motion.span>
                </div>
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
              isLoading={showThinking}
              onStop={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
