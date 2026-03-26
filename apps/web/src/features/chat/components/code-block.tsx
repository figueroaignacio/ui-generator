'use client';

import { useArtifactStore } from '@/features/chat/store/artifact.store';
import { cn } from '@repo/ui/lib/cn';
import { CheckIcon, CopyIcon, PlayIcon } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  language?: string;
  value: string;
  children?: React.ReactNode;
}

export function CodeBlock({ language, value, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const openArtifact = useArtifactStore(s => s.openArtifact);

  const isPreviewable = language === 'tsx' || language === 'jsx';

  const previewInArtifact = () => {
    openArtifact({
      name: 'Component Preview',
      code: value,
      description: 'Manually previewed from markdown code block',
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all">
      <div className="sticky top-0 z-10 flex h-9 items-center justify-between border-b border-border  px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
            {language || 'code'}
          </span>
          {isPreviewable && (
            <button
              onClick={previewInArtifact}
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
            >
              <PlayIcon className="h-2.5 w-2.5" />
              Preview
            </button>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="active:scale-95 rounded-md p-1 transition-colors hover:bg-white/10 focus-ring"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <CheckIcon className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
      <div className="max-h-[600px] overflow-auto">
        <pre
          className={cn(
            'p-4 text-xs leading-relaxed scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent font-code',
            language ? `hljs language-${language}` : 'hljs',
          )}
        >
          <code className="block w-full font-code">{children || value}</code>
        </pre>
      </div>
    </div>
  );
}
