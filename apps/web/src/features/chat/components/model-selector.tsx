'use client';

import { GeminiIcon, GroqIcon } from '@/components/shared/tech-icons';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DropdownLabel,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownSeparator,
} from '@repo/ui/components/dropdown-menu';
import { cn } from '@repo/ui/lib/cn';
import { AI_MODELS, useModelStore } from '../store/model.store';

const ProviderIcon = ({ provider }: { provider: 'groq' | 'google' }) =>
  provider === 'groq' ? <GroqIcon /> : <GeminiIcon />;

const groqModels = AI_MODELS.filter(m => m.provider === 'groq');
const googleModels = AI_MODELS.filter(m => m.provider === 'google');

export function ModelSelector() {
  const { selectedModelId, setSelectedModelId } = useModelStore();
  const selectedModel = AI_MODELS.find(m => m.id === selectedModelId) ?? AI_MODELS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'h-8 gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border-border/60',
          'text-muted-foreground hover:text-foreground',
          'bg-transparent hover:bg-muted/50 transition-colors',
        )}
      >
        <ProviderIcon provider={selectedModel.provider} />
        <span className="max-w-[110px] truncate font-medium">{selectedModel.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 rounded-xl">
        <DropdownLabel>Groq</DropdownLabel>
        {groqModels.map(model => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => setSelectedModelId(model.id)}
            className={cn('gap-2.5', model.id === selectedModelId && 'text-primary')}
          >
            <GroqIcon />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium truncate">{model.label}</span>
              <span className="text-[10px] text-muted-foreground">{model.description}</span>
            </div>
            {model.id === selectedModelId && <HugeiconsIcon icon={Tick02Icon} size={12} />}
          </DropdownMenuItem>
        ))}
        <DropdownSeparator />
        <DropdownLabel>Google</DropdownLabel>
        {googleModels.map(model => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => setSelectedModelId(model.id)}
            className={cn('gap-2.5', model.id === selectedModelId && 'text-primary')}
          >
            <GeminiIcon />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium truncate">{model.label}</span>
              <span className="text-[10px] text-muted-foreground">{model.description}</span>
            </div>
            {model.id === selectedModelId && <HugeiconsIcon icon={Tick02Icon} size={12} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
