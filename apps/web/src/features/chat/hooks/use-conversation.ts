import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  addMessage as apiAddMessage,
  generateResponseStream as apiGenerateStream,
  getConversation,
} from '../api/conversations.api';
import type { Conversation, ConversationWithMessages, Message } from '../types';

export function useConversation(conversationId: string) {
  const queryClient = useQueryClient();
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const generatingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const query = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
  });

  const conversation = query.data;

  const generateMutation = useMutation({
    mutationFn: async () => {
      setStreamingMessage('');

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await apiGenerateStream(conversationId);

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        const decoder = new TextDecoder();
        let done = false;
        let accumulatedText = '';

        while (!done) {
          if (controller.signal.aborted) {
            await reader.cancel();
            break;
          }

          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;
            setStreamingMessage(accumulatedText);
          }
        }
        return accumulatedText;
      } finally {
        abortControllerRef.current = null;
      }
    },
    onSuccess: async finalText => {
      // Optimistically update the cache with the full message to avoid "flash"
      queryClient.setQueryData<ConversationWithMessages>(['conversation', conversationId], old => {
        if (!old) return old;
        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: finalText,
          conversationId,
          createdAt: new Date().toISOString(),
        };
        return {
          ...old,
          messages: [...(old.messages ?? []).filter(m => m.id !== 'streaming'), assistantMsg],
        };
      });

      setStreamingMessage(null);
      generatingRef.current = false;

      // Invalidate in background
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      setStreamingMessage(null);
      generatingRef.current = false;
      abortControllerRef.current = null;
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

    if (
      isFirstUserMessage &&
      !query.isPlaceholderData &&
      isGenerateNotStarted &&
      !generatingRef.current
    ) {
      generatingRef.current = true;
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
      generatingRef.current = true;
      generateMutation.reset();
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
