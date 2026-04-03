"use client";

import { LogoutButton } from "@/modules/auth/components/logout-button";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { useRouter } from "next/navigation";

export function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div>
      <h1>Chat</h1>
      <p>{user?.email}</p>
      <p>{user?.username}</p>
      <LogoutButton />
    </div>
  );
}
