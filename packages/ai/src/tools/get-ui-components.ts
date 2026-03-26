import { tool } from 'ai';
import { z } from 'zod';

const REPO_OWNER = 'figueroaignacio';
const REPO_NAME = 'ui';
const BRANCH = 'main';
const BASE_PATH = 'packages/ui/src';

interface GitHubContentEntry {
  name: string;
  type: 'file' | 'dir';
  size: number;
  download_url: string | null;
}

export const getUIComponent = tool({
  description:
    'Fetch source code from the figueroaignacio/ui component library on GitHub. ' +
    'Use this to study existing component implementations, patterns, CSS styles, utilities, or demos. ' +
    'You can list available files in a folder or fetch the full source code of a specific file.',
  inputSchema: z.object({
    folder: z
      .enum(['components', 'lib', 'css', 'demos'])
      .describe('The folder to browse or fetch from'),
    fileName: z
      .string()
      .optional()
      .describe(
        'The specific file to fetch (e.g. "button.tsx", "cn.ts"). ' +
          'Omit this to list all available files in the folder.',
      ),
  }),
  execute: async ({ folder, fileName }) => {
    try {
      if (!fileName) {
        const listUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${BASE_PATH}/${folder}?ref=${BRANCH}`;
        const listResponse = await fetch(listUrl, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        });

        if (!listResponse.ok) {
          return { error: `Could not list files in "${folder}": ${listResponse.status}` };
        }

        const entries = (await listResponse.json()) as GitHubContentEntry[];

        return {
          folder,
          files: entries.filter(e => e.type === 'file').map(e => ({ name: e.name, size: e.size })),
          totalFiles: entries.filter(e => e.type === 'file').length,
        };
      }

      const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${BASE_PATH}/${folder}/${fileName}`;
      const fileResponse = await fetch(rawUrl);

      if (!fileResponse.ok) {
        return { error: `File not found: ${folder}/${fileName}` };
      }

      const sourceCode = await fileResponse.text();

      return {
        fileName,
        folder,
        sourceCode,
        url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${BASE_PATH}/${folder}/${fileName}`,
      };
    } catch {
      return { error: `Failed to fetch from GitHub: ${folder}/${fileName ?? '(listing)'}` };
    }
  },
});
