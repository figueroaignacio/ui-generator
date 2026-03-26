import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  profileUrl: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  parts: z.array(z.unknown()).optional(),
  conversationId: z.string(),
  createdAt: z.union([z.string(), z.date()]),
});

export const ConversationSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  userId: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

export const ConversationWithMessagesSchema = ConversationSchema.extend({
  messages: z.array(MessageSchema),
});

export type User = z.infer<typeof UserSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type ConversationWithMessages = z.infer<typeof ConversationWithMessagesSchema>;
