'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatHero } from './chat-hero';
import { ChatInput } from './chat-input';
import { ChatMessage, type Message } from './chat-message';
import { ChatSuggestions } from './chat-suggestions';

export function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isHero = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback(async () => {
    const content = input.trim();
    if (!content || isLoading) return;

    setInput('');

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // TODO: wire to POST /api/conversations/:id/messages
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Here's a component for: "${content}"\n\n(Backend integration coming soon)`,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200);
  }, [input, isLoading]);

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
                  isLoading={isLoading}
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
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-start"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-xs">✦</span>
                  </div>
                  <div className="flex gap-1 items-center bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 h-10">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
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
              isLoading={isLoading}
              onStop={() => setIsLoading(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
