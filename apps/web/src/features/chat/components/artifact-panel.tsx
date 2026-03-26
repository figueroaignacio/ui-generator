'use client';

import { useArtifactStore } from '@/features/chat/store/artifact.store';
import { SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';
import { Cancel01Icon, CodeIcon, ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { AnimatePresence, motion } from 'motion/react';
import { CodeBlock } from './code-block';

export function ArtifactPanel() {
  const { isOpen, activeTab, component, closeArtifact, setActiveTab } = useArtifactStore();

  if (!component) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeArtifact}
            className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className={cn(
              'fixed inset-y-0 right-0 z-50 flex flex-col glass-panel shadow-2xl',
              'w-full md:relative md:inset-auto md:z-0 md:w-[55%] xl:w-[65%] md:shadow-2xl',
              'rounded-none md:rounded-2xl my-0 md:my-4 mr-0 md:mr-4 ml-0',
              'h-full md:h-[calc(100vh-2rem)] border-l border-white/5 md:border',
            )}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 h-16">
              <div className="flex items-center gap-3">
                <div className="overflow-hidden">
                  <h3 className="font-heading text-sm font-semibold text-foreground truncate">
                    {component.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg bg-black p-1 border border-border/50">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                      activeTab === 'preview'
                        ? 'bg-secondary text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                    )}
                  >
                    <HugeiconsIcon icon={ViewIcon} size={14} />
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                      activeTab === 'code'
                        ? 'bg-secondary text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                    )}
                  >
                    <HugeiconsIcon icon={CodeIcon} size={14} />
                    Code
                  </button>
                </div>
                <div className="h-4 w-px bg-border/50 mx-1" />
                <button
                  onClick={closeArtifact}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative bg-secondary">
              {activeTab === 'preview' ? (
                <SandpackProvider
                  template="react-ts"
                  theme="dark"
                  files={{
                    '/App.tsx': component.code,
                    '/lib/utils.ts': `
                    import { clsx, type ClassValue } from 'clsx';
                    import { twMerge } from 'tailwind-merge';
                    export function cn(...inputs: ClassValue[]) {
                      return twMerge(clsx(inputs));
                    }
                  `,
                    // Auto-inject Tailwind CDN for the preview
                    '/public/index.html': `
                    <!DOCTYPE html>
                    <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Preview</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                          body { background-color: transparent; color: white; margin: 0; padding: 2rem; display: flex; align-items: flex-start; justify-content: center; min-height: 100vh; }
                        </style>
                      </head>
                      <body>
                        <div id="root"></div>
                      </body>
                    </html>
                  `,
                  }}
                  options={{
                    externalResources: ['https://cdn.tailwindcss.com'],
                  }}
                  customSetup={{
                    dependencies: {
                      next: 'latest',
                      'next-themes': 'latest',
                      'class-variance-authority': 'latest',
                      '@hugeicons/react': 'latest',
                      '@hugeicons/core-free-icons': 'latest',
                      'lucide-react': 'latest',
                      clsx: 'latest',
                      'tailwind-merge': 'latest',
                      'framer-motion': 'latest',
                      motion: 'latest',
                    },
                  }}
                >
                  <SandpackLayout className="border-none! rounded-none! h-full w-full bg-transparent">
                    <SandpackPreview
                      showOpenInCodeSandbox={false}
                      showRefreshButton={true}
                      className="h-full! bg-transparent!"
                    />
                  </SandpackLayout>
                </SandpackProvider>
              ) : (
                <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                  <CodeBlock language="tsx" value={component.code}>
                    {component.code}
                  </CodeBlock>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
