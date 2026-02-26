'use client';

import { ChatInput } from '@/features/chat/components/chat-input';
import { useUIStore } from '@/features/chat/store/ui.store';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

const AI_DISCLAIMERS = [
  '⚠️ May occasionally hallucinate. Like all of us on a Monday.',
  "🧠 Powered by algorithms that don't fully understand themselves either.",
  '🤖 100% AI-generated responses. 0% responsibility taken.',
  '☕ No coffee needed. The GPU handles the existential dread.',
  '🎲 Answers are approximately correct. Results may vary by vibe.',
  '🔮 Not a replacement for a therapist. But cheaper.',
  "📚 Trained on the entire internet. Still can't explain NFTs.",
  '🚀 Faster than a senior dev on a Friday afternoon.',
  '⚡ Groq-powered: so fast it answers before you finish typing.',
  "🌡️ Temperature setting: somewhere between 'boring' and 'creative chaos'.",
  '✨ Gemini can also answer. Google has entered the chat.',
  "🌟 Gemini: trained on Google's entire empire. Still confused by your prompts.",
  "🔵 Switching to Gemini won't make your questions smarter. Just saying.",
  "💫 Gemini 2.0 Flash: blink and you'll miss the response. (You will.)",
  "🤝 Groq + Gemini: two AIs walk into a server room... no punchline, it's just expensive.",
  '🎨 Built by @figueroaignacio — a dev who chose NestJS and TypeScript voluntarily.',
  '👨‍💻 Designed by a human who spent more time on the UI than on sleep.',
  '🧉 Coded with mate, fueled by Stack Overflow and mild panic.',
  '🐛 Any bugs you find are actually undocumented features. — @figueroaignacio, probably.',
  "🎭 The developer said 'it works on my machine' and deployed anyway.",
];

export function MarketingView() {
  const { setAuthDialogOpen } = useUIStore();
  const [disclaimerIndex, setDisclaimerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisclaimerIndex(i => (i + 1) % AI_DISCLAIMERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleIntercept = useCallback(() => {
    setAuthDialogOpen(true);
  }, [setAuthDialogOpen]);

  const passChange = useCallback(() => {}, []);
  const passSubmit = useCallback(() => {}, []);

  return (
    <div className="relative flex flex-col h-full min-h-[calc(100vh-3.5rem)]">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-16 px-4">
        <h1 className="text-3xl sm:text-4xl font-medium text-foreground tracking-tight max-w-xl">
          Hey, Let&apos;s build something together
        </h1>
        <div className="w-full max-w-2xl relative group cursor-pointer" onClick={handleIntercept}>
          <div className="absolute inset-0 z-10" />
          <ChatInput
            value=""
            onChange={passChange}
            onSubmit={passSubmit}
            placeholder="Ask NachAI to generate a component…"
          />
        </div>
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={disclaimerIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="text-xs text-muted-foreground/70 text-center"
            >
              {AI_DISCLAIMERS[disclaimerIndex]}
            </motion.p>
          </AnimatePresence>
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
