import { Injectable, Logger } from '@nestjs/common';
import {
  createAgentUIStreamResponse,
  generateText,
  model,
  nachaiAgent,
  SYSTEM_PROMPT,
  type AIMessage,
  type UIMessage,
} from '@repo/ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  async generateTextResponse(history: AIMessage[]): Promise<string> {
    this.logger.log(`Generating text response for history with ${history.length} messages...`);
    try {
      const result = await nachaiAgent.generate({
        messages: history,
      });
      return result.text;
    } catch (error) {
      this.logger.error(
        `Error generating text response: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async createStreamResponse(
    uiMessages: UIMessage[],
    onFinish: (event: { responseMessage: { parts: any[] } }) => Promise<void>,
  ): Promise<globalThis.Response> {
    return createAgentUIStreamResponse({
      agent: nachaiAgent,
      uiMessages,
      maxSteps: 10,
      onFinish,
    });
  }

  async generateChatTitle(firstMessage: string): Promise<string> {
    try {
      const { text } = await generateText({
        model,
        system: SYSTEM_PROMPT,
        prompt: `Generate a concise, descriptive sidebar title (max 6 words, no quotes, no punctuation at the end) that summarizes this chat request. IMPORTANT: The title MUST be in the EXACT SAME LANGUAGE as the user's request: "${firstMessage}"`,
      });
      return text.trim().slice(0, 100);
    } catch (error) {
      this.logger.error(
        `Failed to generate title: ${error instanceof Error ? error.message : String(error)}`,
      );
      return 'New Conversation';
    }
  }
}
