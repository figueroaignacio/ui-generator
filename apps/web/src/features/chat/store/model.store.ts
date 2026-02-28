'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIModel = {
  id: string;
  label: string;
  provider: 'groq' | 'google';
  description: string;
};

export const AI_MODELS: AIModel[] = [
  {
    id: 'groq/llama-3.3-70b-versatile',
    label: 'Llama 3.3 70B',
    provider: 'groq',
    description: 'Fast · Groq',
  },
  {
    id: 'groq/llama-3.1-8b-instant',
    label: 'Llama 3.1 8B',
    provider: 'groq',
    description: 'Ultra-fast · Groq',
  },
  {
    id: 'google/gemini-2.5-flash-lite',
    label: 'Gemini 2.5 Flash Lite',
    provider: 'google',
    description: 'Fast · Google',
  },
  {
    id: 'google/gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    provider: 'google',
    description: 'Google · Free tier',
  },
];

interface ModelState {
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
}

export const useModelStore = create<ModelState>()(
  persist(
    set => ({
      selectedModelId: 'groq/llama-3.3-70b-versatile',
      setSelectedModelId: id => set({ selectedModelId: id }),
    }),
    { name: 'nachai-model' },
  ),
);
