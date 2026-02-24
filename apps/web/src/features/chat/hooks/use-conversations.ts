import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import {
  createConversation as apiCreateConversation,
  deleteConversation as apiDeleteConversation,
  getConversations,
} from '../api/conversations.api';

import { Conversation } from '../types';

export function useConversations() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  const createMutation = useMutation({
    mutationFn: (title?: string) => apiCreateConversation(title),
    onSuccess: conversation => {
      queryClient.setQueryData<Conversation[]>(['conversations'], (old = []) => [
        conversation,
        ...old,
      ]);
      router.push(`/chat/c/${conversation.id}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiDeleteConversation,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Conversation[]>(['conversations'], (old = []) =>
        old.filter(c => c.id !== id),
      );
      router.push('/chat');
    },
  });

  const createConversation = useCallback(async () => {
    return createMutation.mutateAsync(undefined);
  }, [createMutation]);

  const deleteConversation = useCallback(
    async (id: string) => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  return {
    conversations,
    isLoading: isLoading || createMutation.isPending,
    createConversation,
    deleteConversation,
  };
}
