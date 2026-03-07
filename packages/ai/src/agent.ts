import { ToolLoopAgent } from 'ai';
import { SYSTEM_PROMPT } from './prompts/system-prompt';
import { model } from './providers';
import { getCurrentDate, searchNpmPackage } from './tools';

/*

(•_•)
<)   )╯  if (works) {
 /   \     dontTouchIt();
         } 

*/

// Ladies and gentlemen, I introduce you... the damn NachAI agent. (my second agent)
export const nachaiAgent = new ToolLoopAgent({
  model,
  instructions: SYSTEM_PROMPT,
  tools: {
    getCurrentDate,
    searchNpmPackage,
  },
});
