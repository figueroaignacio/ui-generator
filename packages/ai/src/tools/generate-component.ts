import { tool } from 'ai';
import { z } from 'zod';

export const generateComponent = tool({
  description:
    'Generate a React component. YOU MUST OBLIGATORY USE THIS TOOL when the user explicitly asks to build, create, ' +
    'or make a UI component. DO NOT return the component via markdown! YOU MUST USE THIS TOOL.',
  inputSchema: z.object({
    name: z
      .string()
      .describe('kebab-case name for the component (e.g. "profile-card", "navigation-menu")'),
    description: z.string().describe('Brief one-line description of what the component does'),
    code: z
      .string()
      .describe(
        'Full, self-contained TSX source code of the component. ' +
          'Must be complete and renderable. Use only Tailwind CSS for styling. ' +
          'Export the component as a named export.',
      ),
  }),
});
