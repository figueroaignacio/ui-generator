import { API_URL } from "@/shared/lib/config";

export async function createConversation(title?: string) {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

export async function getConversation(id: string) {
  const res = await fetch(`${API_URL}/conversations/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to get conversation");
  return res.json();
}

export async function getConversations() {
  const res = await fetch(`${API_URL}/conversations`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to get conversations");
  return res.json();
}

export async function streamMessage(id: string, content: string) {
  return fetch(`${API_URL}/conversations/${id}/stream`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}
