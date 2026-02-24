'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { ChatInput } from '@/features/chat/components/chat-input';
import { ChatMessage } from '@/features/chat/components/chat-message';
import { ChatSkeleton } from '@/features/chat/components/chat-skeleton';
import { useConversation } from '@/features/chat/hooks/use-conversation';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface ConversationPageProps {
  id: string;
}

export function ConversationPage({ id }: ConversationPageProps) {
  const { user } = useAuth();
  const { messages, isLoading, isFetching, sendMessage } = useConversation(id);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    const content = input.trim();
    if (!content || isLoading) return;
    setInput('');
    await sendMessage(content);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        {isFetching ? (
          <ChatSkeleton />
        ) : (
          <div className="flex flex-col gap-6 px-4 py-6 max-w-3xl mx-auto w-full">
            {messages.map(msg => (
              <ChatMessage
                key={msg.id}
                message={{ id: msg.id, role: msg.role, content: msg.content }}
                avatarUrl={user?.avatarUrl ?? undefined}
                username={user?.username}
              />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-muted-foreground text-sm font-medium animate-pulse py-2 px-1"
              >
                Thinking...
              </motion.div>
            )}

            <div ref={bottomRef} />
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
            onStop={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
