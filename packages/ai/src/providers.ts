import { google } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import type { LanguageModelV3 } from '@ai-sdk/provider';

export { google };

export function resolveModel(model: string, groqApiKey: string): LanguageModelV3 {
  const groq = createGroq({ apiKey: groqApiKey });

  if (model.startsWith('groq/')) return groq(model.replace('groq/', ''));
  if (model.startsWith('google/')) return google(model.replace('google/', ''));

  return groq('llama-3.3-70b-versatile');
}
