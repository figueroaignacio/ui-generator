import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    providers: 'src/providers.ts',
    agent: 'src/agent.ts',
    'prompts/system-prompt': 'src/prompts/system-prompt.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
});
