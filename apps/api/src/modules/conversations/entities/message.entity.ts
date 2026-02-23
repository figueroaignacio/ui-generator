import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MessageRole })
  role: MessageRole;

  @Column({ type: 'text' })
  content: string;

  @Index()
  @Column()
  conversationId: string;

  @ManyToOne(() => Conversation, conversation => conversation.messages, {
    onDelete: 'CASCADE',
  })
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;
}
