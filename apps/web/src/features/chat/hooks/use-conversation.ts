import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addMessage as apiAddMessage,
  generateResponseStream as apiGenerateStream,
  getConversation,
} from '../api/conversations.api';
import type { Conversation, ConversationWithMessages, Message } from '../types';

export function useConversation(conversationId: string) {
  const queryClient = useQueryClient();
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
  });

  const conversation = query.data;

  const generateMutation = useMutation({
    mutationFn: async () => {
      setStreamingMessage('');
      const response = await apiGenerateStream(conversationId);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });

        accumulatedText += chunk;
        setStreamingMessage(accumulatedText);
      }

      return accumulatedText;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] }),
        queryClient.invalidateQueries({ queryKey: ['conversations'] }),
      ]);
      setStreamingMessage(null);
    },
    onError: () => {
      setStreamingMessage(null);
    },
  });

  const messages = useMemo(() => {
    const baseMessages = conversation?.messages ?? [];
    if (streamingMessage !== null) {
      return [
        ...baseMessages,
        {
          id: 'streaming',
          role: 'assistant',
          content: streamingMessage,
          conversationId,
          createdAt: new Date().toISOString(),
        } as Message,
      ];
    }
    return baseMessages;
  }, [conversation, streamingMessage, conversationId]);

  useEffect(() => {
    if (!conversation) return;

    if (conversation.id && conversation.title) {
      queryClient.setQueryData<Conversation[]>(['conversations'], old =>
        old?.map(c => (c.id === conversation.id ? { ...c, title: conversation.title! } : c)),
      );
    }

    const isFirstUserMessage = messages.length === 1 && messages[0].role === 'user';
    const isGenerateNotStarted =
      generateMutation.isIdle && !generateMutation.isPending && !generateMutation.isSuccess;

    if (isFirstUserMessage && !query.isPlaceholderData && isGenerateNotStarted) {
      generateMutation.mutate();
    }
  }, [
    conversation,
    conversationId,
    messages,
    query.isPlaceholderData,
    queryClient,
    generateMutation,
  ]);

  const addMessageMutation = useMutation({
    mutationFn: (content: string) => apiAddMessage(conversationId, 'user', content),
    onMutate: async content => {
      await queryClient.cancelQueries({ queryKey: ['conversation', conversationId] });
      const previousConversation = queryClient.getQueryData<ConversationWithMessages>([
        'conversation',
        conversationId,
      ]);

      const optimisticUserMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        conversationId,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<ConversationWithMessages>(['conversation', conversationId], old => {
        if (!old) return old;
        return {
          ...old,
          messages: [...(old.messages ?? []), optimisticUserMsg],
        };
      });

      return { previousConversation };
    },
    onError: (_err, _content, context) => {
      if (context?.previousConversation) {
        queryClient.setQueryData(['conversation', conversationId], context.previousConversation);
      }
    },
    onSuccess: () => {
      setStreamingMessage('');
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      generateMutation.mutate();
    },
  });

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || addMessageMutation.isPending || generateMutation.isPending) return;
      return addMessageMutation.mutateAsync(content);
    },
    [addMessageMutation, generateMutation],
  );

  return {
    messages,
    isLoading: addMessageMutation.isPending || generateMutation.isPending,
    isFetching: query.isLoading,
    sendMessage,
  };
}
