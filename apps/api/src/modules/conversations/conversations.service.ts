import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { type AIMessage, type UIMessage } from '@repo/ai';
import { AiService } from '../ai/ai.service';
import { ConversationsRepository } from './conversations.repository';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Message, MessageRole } from './entities/message.entity';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);

  constructor(
    private readonly repository: ConversationsRepository,
    private readonly aiService: AiService,
  ) {}

  async create(userId: string, dto: CreateConversationDto): Promise<Conversation> {
    return await this.repository.create(userId, dto.title);
  }

  async findAllByUser(userId: string): Promise<Conversation[]> {
    return await this.repository.findByUser(userId);
  }

  async findOne(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.repository.findOneWithMessages(id);

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    if (conversation.userId !== userId) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    return conversation;
  }

  async addMessage(
    conversationId: string,
    userId: string,
    dto: CreateMessageDto,
  ): Promise<Message> {
    const conversation = await this.findOne(conversationId, userId);

    const message = await this.repository.createMessage({
      ...dto,
      conversationId,
      parts: (dto.parts as any[]) || [],
    });

    if (dto.role === MessageRole.USER && !conversation.title) {
      void this.generateAndSaveTitle(conversation, dto.content);
    }

    await this.repository.updateTimestamp(conversationId);

    return message;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.repository.delete(id);
  }

  async generateResponse(conversationId: string, userId: string): Promise<Message> {
    this.logger.log(`[generateResponse] Started for ID: ${conversationId}, User: ${userId}`);
    const conversation = await this.findOne(conversationId, userId);

    if (!conversation.messages || conversation.messages.length === 0) {
      this.logger.warn(`[generateResponse] No messages found for conversation ${conversationId}`);
      throw new NotFoundException('No messages found in this conversation');
    }

    const history: AIMessage[] = conversation.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    try {
      const text = await this.aiService.generateTextResponse(history);

      const saved = await this.repository.createMessage({
        role: MessageRole.ASSISTANT,
        content: text,
        conversationId,
      });

      await this.repository.updateTimestamp(conversationId);

      return saved;
    } catch (error) {
      this.logger.error(
        `[generateResponse] ERROR in generateResponse: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new InternalServerErrorException(
        `Agent Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async generateStreamResponse(
    conversationId: string,
    userId: string,
    uiMessages: UIMessage[],
  ): Promise<globalThis.Response> {
    this.logger.log(`[generateStreamResponse] Started for ID: ${conversationId}, User: ${userId}`);
    const conversation = await this.findOne(conversationId, userId);

    if (uiMessages.length > 0) {
      const lastMsg = uiMessages[uiMessages.length - 1];
      if (lastMsg.role === 'user') {
        const textContent =
          typeof lastMsg.content === 'string'
            ? lastMsg.content
            : (lastMsg.parts
                ?.filter(p => p.type === 'text')
                .map(p => (p as any).text)
                .join('') ?? '');

        if (textContent) {
          await this.repository.createMessage({
            role: MessageRole.USER,
            content: textContent,
            parts: lastMsg.parts as any[],
            conversationId,
          });

          if (!conversation.title) {
            void this.generateAndSaveTitle(conversation, textContent);
          }

          await this.repository.updateTimestamp(conversationId);
        }
      }
    }

    return this.aiService.createStreamResponse(uiMessages, async ({ responseMessage }) => {
      const parts = responseMessage.parts as any[];
      const text = parts
        ?.filter(p => p.type === 'text')
        .map(p => p.text)
        .join('');

      if (text || parts?.length) {
        this.logger.log(
          `[generateStreamResponse] Finished, saving message with ${parts?.length ?? 0} parts...`,
        );
        await this.repository.createMessage({
          role: MessageRole.ASSISTANT,
          content: text ?? '',
          parts: parts,
          conversationId,
        });
        await this.repository.updateTimestamp(conversationId);
      }
    });
  }

  private async generateAndSaveTitle(
    conversation: Conversation,
    firstMessage: string,
  ): Promise<void> {
    try {
      const title = await this.aiService.generateChatTitle(firstMessage);
      await this.repository.updateTitle(conversation.id, title);
    } catch (err) {
      this.logger.error(
        `Failed to generate title for conversation ${conversation.id}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
