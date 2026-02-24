'use client';

export function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-3xl mx-auto w-full">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`flex gap-3 items-start ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <div className="h-8 w-8 rounded-full bg-muted/60 shrink-0" />
          <div
            className={`flex flex-col gap-2 max-w-[80%] ${i % 2 === 0 ? 'items-start' : 'items-end'}`}
          >
            <div className="h-10 rounded-2xl bg-muted/40 animate-pulse w-48" />
            {i % 3 === 0 && (
              <div className="h-16 rounded-2xl bg-muted/30 animate-pulse w-[200px]" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
