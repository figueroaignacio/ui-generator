import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { streamMessage } from "../api/conversations.api";
import { useConversation } from "../hooks/use-conversations";
import { useChatStore } from "../store/chat.store";

interface ApiMessage {
  role: string;
  content: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ConversationPage() {
  const { id } = useParams({ from: "/chat/c/$id" });
  const { pendingMessage, setPendingMessage } = useChatStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const historyLoaded = useRef(false);

  const { data: conversation, isLoading } = useConversation(id);

  useEffect(() => {
    if (
      conversation?.messages &&
      !historyLoaded.current &&
      !hasInitialized.current
    ) {
      historyLoaded.current = true;
      setMessages(
        conversation.messages.map((m: ApiMessage) => ({
          role: m.role.toLowerCase() as "user" | "assistant",
          content: m.content,
        })),
      );
    }
  }, [conversation]);

  useEffect(() => {
    if (pendingMessage && !hasInitialized.current) {
      hasInitialized.current = true;
      historyLoaded.current = true;
      const msg = pendingMessage;
      setPendingMessage(null);
      sendMessage(msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || isStreaming) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await streamMessage(id, content);
      if (!res.ok) throw new Error("Stream failed");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const chunk = line.replace("data: ", "");
          if (chunk === "[DONE]") break;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: updated[updated.length - 1].content + chunk,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Stream error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
      setInput("");
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground"
                }`}>
                {msg.content || (
                  <span className="animate-pulse text-muted-foreground">
                    ...
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="max-w-2xl mx-auto w-full rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col p-4 gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={3}
              disabled={isStreaming}
              className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none disabled:opacity-50"
            />
            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  sendMessage(input);
                  setInput("");
                }}
                disabled={!input.trim() || isStreaming}
                className="flex items-center justify-center size-8 rounded-full bg-foreground text-background disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 transition-opacity">
                <HugeiconsIcon icon={ArrowUp02Icon} size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
