import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { generateText, resolveModel, streamText, SYSTEM_PROMPT } from '@repo/ai';
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
    private readonly configService: ConfigService,
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
      this.logger.log(
        `[generateResponse] Calling Groq (llama-3.3-70b-versatile) for conversation ${conversationId}...`,
      );
      const { text } = await generateText({
        model: this.resolveModel('groq/llama-3.3-70b-versatile'),
        system: SYSTEM_PROMPT,
        messages: history,
      });

      this.logger.log(`[generateResponse] Gemini success, text length: ${text.length}`);

      const assistantMessage = this.messageRepo.create({
        role: MessageRole.ASSISTANT,
        content: text,
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
      throw new InternalServerErrorException(`Gemini Error: ${error.message}`);
    }
  }

  private resolveModel(model: string) {
    return resolveModel(model, this.configService.get<string>('GROQ_API_KEY') ?? '');
  }

  async generateStreamResponse(
    conversationId: string,
    userId: string,
    model = 'groq/llama-3.3-70b-versatile',
  ): Promise<any> {
    this.logger.log(`[generateStreamResponse] Started for ID: ${conversationId}, User: ${userId}`);
    const conversation = await this.findOne(conversationId, userId);

    if (!conversation.messages || conversation.messages.length === 0) {
      throw new NotFoundException('No messages found in this conversation');
    }

    const history = conversation.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })) as any[];

    const result = streamText({
      model: this.resolveModel(model),
      system: SYSTEM_PROMPT,
      messages: history,
      onFinish: async ({ text }) => {
        this.logger.log(`[generateStreamResponse] Finished, saving message...`);
        const assistantMessage = this.messageRepo.create({
          role: MessageRole.ASSISTANT,
          content: text,
          conversationId,
        });
        await this.messageRepo.save(assistantMessage);
        await this.conversationRepo.update(conversationId, { updatedAt: new Date() });
      },
    });

    return result;
  }

  private generateAndSaveTitle(conversation: Conversation, firstMessage: string): void {
    generateText({
      model: this.resolveModel('groq/llama-3.3-70b-versatile'),
      system: SYSTEM_PROMPT,
      prompt: `Generate a concise, descriptive sidebar title (max 6 words, no quotes, no punctuation at the end) that summarizes this chat request: "${firstMessage}"`,
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
