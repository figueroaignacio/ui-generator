import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createAgentUIStreamResponse,
  generateText,
  model,
  nachaiAgent,
  SYSTEM_PROMPT,
} from '@repo/ai';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Message, MessageRole } from './entities/message.entity';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async create(userId: string, dto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepo.create({
      ...dto,
      userId,
    });
    return await this.conversationRepo.save(conversation);
  }

  async findAllByUser(userId: string): Promise<Conversation[]> {
    return await this.conversationRepo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      select: ['id', 'title', 'userId', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepo.findOne({
      where: { id },
      relations: ['messages'],
      order: { messages: { createdAt: 'ASC' } } as any,
    });

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

    const message = this.messageRepo.create({
      ...dto,
      conversationId,
    });
    const savedMessage = await this.messageRepo.save(message);

    if (dto.role === MessageRole.USER && !conversation.title) {
      this.generateAndSaveTitle(conversation, dto.content);
    }

    await this.conversationRepo.update(conversationId, {
      updatedAt: new Date(),
    });

    return savedMessage;
  }

  async remove(id: string, userId: string): Promise<void> {
    const conversation = await this.findOne(id, userId);
    await this.conversationRepo.remove(conversation);
  }

  async generateResponse(conversationId: string, userId: string): Promise<Message> {
    this.logger.log(`[generateResponse] Started for ID: ${conversationId}, User: ${userId}`);
    const conversation = await this.findOne(conversationId, userId);

    if (!conversation.messages || conversation.messages.length === 0) {
      this.logger.warn(`[generateResponse] No messages found for conversation ${conversationId}`);
      throw new NotFoundException('No messages found in this conversation');
    }

    const history = conversation.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })) as any[];

    try {
      this.logger.log(`[generateResponse] Calling agent for conversation ${conversationId}...`);
      const result = await nachaiAgent.generate({
        messages: history,
      });

      this.logger.log(`[generateResponse] Agent success, text length: ${result.text.length}`);

      const assistantMessage = this.messageRepo.create({
        role: MessageRole.ASSISTANT,
        content: result.text,
        conversationId,
      });

      const saved = await this.messageRepo.save(assistantMessage);
      await this.conversationRepo.update(conversationId, { updatedAt: new Date() });

      return saved;
    } catch (error) {
      this.logger.error(
        `[generateResponse] ERROR in generateResponse: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(`Agent Error: ${error.message}`);
    }
  }

  async generateStreamResponse(
    conversationId: string,
    userId: string,
    uiMessages: any[],
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
                ?.filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('') ?? '');

        if (textContent) {
          const userMessage = this.messageRepo.create({
            role: MessageRole.USER,
            content: textContent,
            conversationId,
          });
          await this.messageRepo.save(userMessage);

          if (!conversation.title) {
            this.generateAndSaveTitle(conversation, textContent);
          }

          await this.conversationRepo.update(conversationId, { updatedAt: new Date() });
        }
      }
    }

    return createAgentUIStreamResponse({
      agent: nachaiAgent as any,
      uiMessages,
      onFinish: async ({ responseMessage }) => {
        const text = responseMessage.parts
          ?.filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');

        if (text) {
          this.logger.log(`[generateStreamResponse] Finished, saving message...`);
          const assistantMessage = this.messageRepo.create({
            role: MessageRole.ASSISTANT,
            content: text,
            conversationId,
          });
          await this.messageRepo.save(assistantMessage);
          await this.conversationRepo.update(conversationId, { updatedAt: new Date() });
        }
      },
    });
  }

  private generateAndSaveTitle(conversation: Conversation, firstMessage: string): void {
    generateText({
      model,
      system: SYSTEM_PROMPT,
      prompt: `Generate a concise, descriptive sidebar title (max 6 words, no quotes, no punctuation at the end) that summarizes this chat request. IMPORTANT: The title MUST be in the EXACT SAME LANGUAGE as the user's request: "${firstMessage}"`,
    })
      .then(({ text }) => {
        const title = text.trim().slice(0, 100);
        return this.conversationRepo.update(conversation.id, { title });
      })
      .catch(err => {
        this.logger.error(
          `Failed to generate title for conversation ${conversation.id}: ${err.message}`,
        );
      });
  }
}
