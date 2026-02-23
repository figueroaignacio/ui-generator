'use client';

import { create } from 'zustand';
import type { Conversation } from '../types';

interface ConversationsState {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
}

export const useConversationsStore = create<ConversationsState>(set => ({
  conversations: [],

  setConversations: conversations => set({ conversations }),

  addConversation: conversation =>
    set(state => ({ conversations: [conversation, ...state.conversations] })),

  removeConversation: id =>
    set(state => ({ conversations: state.conversations.filter(c => c.id !== id) })),

  updateConversationTitle: (id, title) =>
    set(state => ({
      conversations: state.conversations.map(c => (c.id === id ? { ...c, title } : c)),
    })),
}));
