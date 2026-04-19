import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCreateConversation } from "../hooks/use-conversations";
import { useChatStore } from "../store/chat.store";

export function ChatPromptBox() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { mutateAsync: createConversation, isPending } =
    useCreateConversation();

  const { setPendingMessage } = useChatStore();

  async function handleSubmit() {
    if (!value.trim() || isPending) return;
    setPendingMessage(value);
    const conversation = await createConversation(undefined);
    navigate({
      to: "/chat/c/$id",
      params: { id: conversation.id },
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col p-4 gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={3}
          className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
        />
        <div className="flex items-center justify-end">
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isPending}
            className="flex items-center justify-center size-8 rounded-full bg-foreground text-background disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 transition-opacity">
            <HugeiconsIcon icon={ArrowUp02Icon} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
