'use client';

import { cn } from '@repo/ui/lib/cn';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  language?: string;
  value: string;
  children?: React.ReactNode;
}

export function CodeBlock({ language, value, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

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
    <div className="group relative my-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="sticky top-0 z-10 flex h-10 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/90">
          {language || 'code'}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="max-h-[600px] overflow-auto">
        <pre
          className={cn(
            'p-4 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent',
            language ? `hljs language-${language}` : 'hljs',
          )}
        >
          <code className="block w-full">{children || value}</code>
        </pre>
      </div>
    </div>
  );
}
