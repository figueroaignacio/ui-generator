'use client';

import { ChatInput } from '@/features/chat/components/chat-input';
import { useUIStore } from '@/features/chat/store/ui.store';

export function MarketingView() {
  const { setAuthDialogOpen } = useUIStore();

  const handleIntercept = () => {
    setAuthDialogOpen(true);
  };

  return (
    <div className="relative flex flex-col h-full min-h-[calc(100vh-3.5rem)]">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-16 px-4">
        <h1 className="text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
          Hey, What shall we build?
        </h1>

        <div className="w-full max-w-2xl relative group cursor-pointer" onClick={handleIntercept}>
          <div className="absolute inset-0 z-10" />
          <ChatInput
            value=""
            onChange={() => {}}
            onSubmit={() => {}}
            placeholder="Ask NachAI anything..."
          />
        </div>
        <p className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full text-center px-4 text-[11px] text-muted-foreground/60 max-w-2xl leading-relaxed">
          By messaging NachAI, you agree to our{' '}
          <span className="underline underline-offset-2">Terms</span> and confirm you have read our{' '}
          <span className="underline underline-offset-2">Privacy Policy</span>. NachAI is an AI
          assistant and may provide inaccurate information.
        </p>
      </div>
    </div>
  );
}
