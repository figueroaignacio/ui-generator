import { tool } from 'ai';
import { z } from 'zod';

interface NpmPackageData {
  name: string;
  description?: string;
  license?: string;
  homepage?: string;
  repository?: string | { url?: string };
  keywords?: string[];
  'dist-tags'?: Record<string, string>;
  versions?: Record<string, { license?: string; dependencies?: Record<string, string> }>;
}

export const searchNpmPackage = tool({
  description:
    'Search for an npm package and get its metadata (description, latest version, dependencies, repository). Use this when the user asks about a specific npm package or needs to compare packages.',
  inputSchema: z.object({
    packageName: z
      .string()
      .describe('The npm package name to look up (e.g. "react", "@tanstack/react-query")'),
  }),
  execute: async ({ packageName }) => {
    try {
      const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`);

      if (!response.ok) {
        return { error: `Package "${packageName}" not found on npm.` };
      }

      const data = (await response.json()) as NpmPackageData;
      const latest = data['dist-tags']?.latest;
      const latestVersion = latest ? data.versions?.[latest] : undefined;

      return {
        name: data.name,
        description: data.description ?? 'No description',
        latestVersion: latest ?? 'unknown',
        license: latestVersion?.license ?? data.license ?? 'unknown',
        homepage: data.homepage ?? null,
        repository:
          typeof data.repository === 'object' ? data.repository?.url : (data.repository ?? null),
        keywords: (data.keywords ?? []).slice(0, 10),
        dependencies: latestVersion?.dependencies
          ? Object.keys(latestVersion.dependencies).slice(0, 15)
          : [],
      };
    } catch {
      return { error: `Failed to fetch package info for "${packageName}".` };
    }
  },
});
