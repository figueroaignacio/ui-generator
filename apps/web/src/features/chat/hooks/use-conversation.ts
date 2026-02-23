'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  addMessage as apiAddMessage,
  generateResponse as apiGenerate,
  getConversation,
} from '../api/conversations.api';
import { useConversationsStore } from '../store/conversations.store';
import type { Message } from '../types';

export function useConversation(conversationId: string) {
  const updateConversationTitle = useConversationsStore(s => s.updateConversationTitle);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Load conversation history
  useEffect(() => {
    setIsFetching(true);
    getConversation(conversationId)
      .then(data => {
        const msgs = data.messages ?? [];
        setMessages(msgs);
        if (data.title) updateConversationTitle(conversationId, data.title);

        // Auto-respond if first user message is solitary
        if (msgs.length === 1 && msgs[0].role === 'user' && !isLoading) {
          apiGenerate(conversationId).then(assistantMsg => {
            setMessages(prev => [...prev, assistantMsg]);
          });
        }
      })
      .catch(err => console.error('Failed to load conversation:', err))
      .finally(() => setIsFetching(false));
  }, [conversationId, updateConversationTitle, isLoading]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;
      setIsLoading(true);

      // Optimistic: show user message immediately
      const optimisticUserMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        conversationId,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, optimisticUserMsg]);

      try {
        // 1. Persist user message
        const savedUserMsg = await apiAddMessage(conversationId, 'user', content);
        // Replace optimistic entry with server-confirmed one
        setMessages(prev => prev.map(m => (m.id === optimisticUserMsg.id ? savedUserMsg : m)));

        // 2. Ask Gemini to generate a response
        const assistantMsg = await apiGenerate(conversationId);
        setMessages(prev => [...prev, assistantMsg]);
      } catch (err) {
        console.error('Failed to send message:', err);
        // Roll back optimistic message on error
        setMessages(prev => prev.filter(m => m.id !== optimisticUserMsg.id));
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, isLoading],
  );

  return { messages, isLoading, isFetching, sendMessage };
}
