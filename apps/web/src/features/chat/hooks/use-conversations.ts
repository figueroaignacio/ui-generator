'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  createConversation as apiCreateConversation,
  deleteConversation as apiDeleteConversation,
  getConversations,
} from '../api/conversations.api';
import { useConversationsStore } from '../store/conversations.store';

export function useConversations() {
  const router = useRouter();
  const { conversations, setConversations, addConversation, removeConversation } =
    useConversationsStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(err => console.error('Failed to fetch conversations:', err));
  }, [setConversations]);

  const createConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      const conversation = await apiCreateConversation();
      addConversation(conversation);
      router.push(`/chat/c/${conversation.id}`);
    } catch (err) {
      console.error('Failed to create conversation:', err);
    } finally {
      setIsLoading(false);
    }
  }, [addConversation, router]);

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        await apiDeleteConversation(id);
        removeConversation(id);
        router.push('/chat');
      } catch (err) {
        console.error('Failed to delete conversation:', err);
      }
    },
    [removeConversation, router],
  );

  return {
    conversations,
    isLoading,
    createConversation,
    deleteConversation,
  };
}
