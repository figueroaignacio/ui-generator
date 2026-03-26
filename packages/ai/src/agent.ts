import { ToolLoopAgent } from 'ai';
import { SYSTEM_PROMPT } from './prompts/system-prompt';
import { model } from './providers';
import { getUIComponent } from './tools/get-ui-components';

export const nachaiAgent = new ToolLoopAgent({
  model,
  instructions: SYSTEM_PROMPT,
  tools: {
    getUIComponent,
  },
});
