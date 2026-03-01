'use client';

import { ChatInput } from '@/features/chat/components/chat-input';
import { ChatMessage } from '@/features/chat/components/chat-message';
import { ChatSkeleton } from '@/features/chat/components/chat-skeleton';
import { useConversation } from '@/features/chat/hooks/use-conversation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface ConversationPageProps {
  id: string;
}

const contentInitial = { opacity: 0 };
const contentAnimate = { opacity: 1 };
const contentExit = { opacity: 0 };

const passStop = () => {};

export function ConversationPage({ id }: ConversationPageProps) {
  const { messages, isLoading, isFetching, sendMessage } = useConversation(id);
  const [input, setInput] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Auto-scroll during streaming
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async () => {
    const content = input.trim();
    if (!content || isLoading) return;
    setInput('');
    await sendMessage(content);
  };

  // Detect if the AI is "thinking" (loading started, but no streaming content yet)
  const streamingMsg = messages.find(m => m.id === 'streaming');
  const isThinking = isLoading && (!streamingMsg || streamingMsg.content === '');

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isFetching && messages.length === 0 ? (
            <ChatSkeleton key="skeleton" />
          ) : (
            <motion.div
              key="content"
              initial={contentInitial}
              animate={contentAnimate}
              exit={contentExit}
              className="flex flex-col gap-6 px-4 py-6 max-w-3xl mx-auto w-full"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map(msg => {
                if (msg.id === 'streaming' && isThinking) return null;
                return (
                  <ChatMessage
                    key={msg.id}
                    message={{ id: msg.id, role: msg.role, content: msg.content }}
                    isStreaming={msg.id === 'streaming'}
                  />
                );
              })}

              <AnimatePresence>
                {isThinking && (
                  <motion.div
                    layout
                    initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="flex items-center gap-3 py-3 px-1"
                    role="status"
                    aria-label="Generating response"
                  >
                    <div className="flex items-center gap-[3px]">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="w-[5px] h-[5px] rounded-full bg-primary/70"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.12,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm">Generating...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} className="h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="shrink-0 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onStop={passStop}
          />
        </div>
      </div>
    </div>
  );
}
