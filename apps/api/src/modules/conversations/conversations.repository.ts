import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ConversationsRepository {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async findByUser(userId: string): Promise<Conversation[]> {
    return await this.conversationRepo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      select: ['id', 'title', 'userId', 'createdAt', 'updatedAt'],
    });
  }

  async findOneWithMessages(id: string): Promise<Conversation | null> {
    return await this.conversationRepo.findOne({
      where: { id },
      relations: ['messages'],
      order: { messages: { createdAt: 'ASC' } } as any,
    });
  }

  async create(userId: string, title?: string): Promise<Conversation> {
    const conversation = this.conversationRepo.create({
      userId,
      title,
    });
    return await this.conversationRepo.save(conversation);
  }

  async updateTitle(id: string, title: string): Promise<void> {
    await this.conversationRepo.update(id, { title });
  }

  async updateTimestamp(id: string): Promise<void> {
    await this.conversationRepo.update(id, { updatedAt: new Date() });
  }

  async delete(id: string): Promise<void> {
    await this.conversationRepo.delete(id);
  }

  async saveMessage(message: Message): Promise<Message> {
    return await this.messageRepo.save(message);
  }

  async createMessage(data: Partial<Message>): Promise<Message> {
    const message = this.messageRepo.create(data);
    return await this.messageRepo.save(message);
  }
}
