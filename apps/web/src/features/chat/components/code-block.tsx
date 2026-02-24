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
    <div className="group relative my-4 overflow-hidden rounded-xl border border-border bg-[#1e1f20] shadow-sm transition-all hover:shadow-md">
      <div className="sticky top-0 z-10 flex h-9 items-center justify-between border-b border-border bg-[#1e1f20]/95 px-4 backdrop-blur-md">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          {language || 'code'}
        </span>
        <button onClick={copyToClipboard} className="active:scale-95" aria-label="Copy code">
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-green-500" />
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
            </>
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
