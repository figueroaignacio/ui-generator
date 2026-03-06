import { tool } from 'ai';
import { z } from 'zod';

export const getCurrentDate = tool({
  description:
    'Get the current date and time. Useful for providing time-aware responses or when the user asks about current date/time.',
  inputSchema: z.object({}),
  execute: async () => {
    const now = new Date();
    return {
      iso: now.toISOString(),
      date: now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  },
});
