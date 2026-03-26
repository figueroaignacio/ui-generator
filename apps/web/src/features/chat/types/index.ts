export interface Conversation {
  id: string;
  title: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  conversationId: string;
  createdAt: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export interface SafePart {
  type: string;
  text?: string;
  toolInvocation?: {
    toolName: string;
    args: Record<string, unknown>;
    input?: unknown;
    result?: unknown;
    state: string;
    toolCallId: string;
  };
  args?: Record<string, unknown>;
  input?: unknown;
  result?: unknown;
  state?: string;
  toolCallId?: string;
  error?: unknown;
}
