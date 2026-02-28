'use client';

import { ChatInput } from '@/features/chat/components/chat-input';
import { ChatMessage } from '@/features/chat/components/chat-message';
import { ChatSkeleton } from '@/features/chat/components/chat-skeleton';
import { useConversation } from '@/features/chat/hooks/use-conversation';
import { AnimatePresence, motion } from 'motion/react';
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

  useEffect(() => {
    if (!isLoading) return;
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  const prevLengthRef = useRef(messages.length);
  useEffect(() => {
    if (isLoading) return;
    if (messages.length !== prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    const content = input.trim();
    if (!content || isLoading) return;
    setInput('');
    await sendMessage(content);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scroll-smooth">
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
            >
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={{ id: msg.id, role: msg.role, content: msg.content }}
                  isStreaming={msg.id === 'streaming'}
                />
              ))}

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
