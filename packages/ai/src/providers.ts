import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModelV3 } from '@ai-sdk/provider';

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const model: LanguageModelV3 = google('gemini-2.5-flash');

export const MODEL_ID = 'gemini-2.5-flash' as const;
