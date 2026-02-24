'use client';

import { cn } from '@repo/ui/lib/cn';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
}

export function MarkdownRenderer({ content, className, isStreaming }: MarkdownRendererProps) {
  return (
    <div className={cn('markdown-content space-y-4 relative', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');
            const isMultiline = value.includes('\n');

            if (!inline && (match || isMultiline)) {
              return (
                <CodeBlock language={match?.[1]} value={value}>
                  {children}
                </CodeBlock>
              );
            }

            return (
              <code
                className={cn(
                  'relative rounded-lg bg-muted/70 border border-border/50 px-2 py-1 font-jetbrains text-[0.85em] font-semibold text-foreground break-all',
                  className,
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-xl font-bold tracking-tight text-foreground mt-6 mb-3 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold tracking-tight text-foreground mt-5 mb-2 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold tracking-tight text-foreground mt-4 mb-1.5 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-foreground/90 mb-4 last:mb-0">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc [&>li]:mt-1 text-sm text-foreground/90 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal [&>li]:mt-1 text-sm text-foreground/90 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
          hr: () => <hr className="my-6 border-border/50" />,
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-primary/50 pl-4 italic text-muted-foreground bg-muted/20 py-1.5 rounded-r-lg">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-4 w-full overflow-y-auto rounded-lg border border-border shadow-xs">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-muted/50 px-4 py-2 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-4 py-2 text-left text-foreground/80">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && !content && (
        <div
          className="flex items-center gap-2 py-2 px-1 text-muted-foreground/80 font-medium text-sm animate-pulse"
          aria-label="Thinking..."
        >
          <span className="italic tracking-tight">Thinking...</span>
        </div>
      )}
    </div>
  );
}
