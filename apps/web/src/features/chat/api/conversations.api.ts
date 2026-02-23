import type { Conversation, ConversationWithMessages, Message } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function fetchWithCredentials(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    console.error(`API Error [${res.status}] ${path}:`, error);
    throw new Error(error || `Request failed: ${res.status}`);
  }

  // Clone response to log it without consuming the stream
  res
    .clone()
    .json()
    .then(data => {
      console.log(`API Response [${res.status}] ${path}:`, data);
    })
    .catch(() => {});

  return res;
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetchWithCredentials('/api/conversations');
  return res.json();
}

export async function createConversation(title?: string): Promise<Conversation> {
  const res = await fetchWithCredentials('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function getConversation(id: string): Promise<ConversationWithMessages> {
  const res = await fetchWithCredentials(`/api/conversations/${id}`);
  return res.json();
}

export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
): Promise<Message> {
  const res = await fetchWithCredentials(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ role, content }),
  });
  return res.json();
}

export async function generateResponse(conversationId: string): Promise<Message> {
  const res = await fetchWithCredentials(`/api/conversations/${conversationId}/generate`, {
    method: 'POST',
  });
  return res.json();
}

export async function deleteConversation(id: string): Promise<void> {
  await fetchWithCredentials(`/api/conversations/${id}`, { method: 'DELETE' });
}
