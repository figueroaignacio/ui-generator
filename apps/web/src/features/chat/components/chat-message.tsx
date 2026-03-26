import { useArtifactStore } from '@/features/chat/store/artifact.store';
import { type SafePart } from '@/features/chat/types';
import { cn } from '@repo/ui/lib/cn';
import type { UIMessage } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'motion/react';
import { memo } from 'react';
import { MessagePartRenderer } from './message-part-renderer';

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export const ChatMessage = memo(({ message, isStreaming }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const openArtifact = useArtifactStore(s => s.openArtifact);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex gap-3 w-full items-start', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-full rounded-2xl text-sm leading-relaxed relative transition-all duration-300',
          isUser
            ? 'bg-card rounded-tr-sm px-4 py-2.5 shadow-sm ring-1 ring-border/50 w-fit'
            : 'text-foreground px-0 w-full',
        )}
      >
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {message.parts.map((item, index) => (
              <motion.div
                key={`${message.id}-part-${index}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <MessagePartRenderer
                  part={item as SafePart}
                  messageId={message.id}
                  index={index}
                  isStreaming={!!(isStreaming && index === message.parts.length - 1)}
                  onOpenArtifact={openArtifact}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = 'ChatMessage';
