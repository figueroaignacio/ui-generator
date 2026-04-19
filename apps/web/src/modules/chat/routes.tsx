import { rootRoute } from "@/router";
import { createRoute, redirect } from "@tanstack/react-router";
import { fetchMe } from "../auth/api/auth.api";
import { useAuthStore } from "../auth/store/auth.store";
import { ChatPage } from "./components/chat-page";
import { ConversationPage } from "./components/conversation-page";
import { ChatLayout } from "./layout";

export const chatLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatLayout,
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/chat") {
      throw redirect({ to: "/chat/new" });
    }

    let user = useAuthStore.getState().user;

    if (!user) {
      user = await fetchMe();
      if (user) {
        useAuthStore.getState().setUser(user);
      }
    }

    if (!user) {
      throw redirect({ to: "/" });
    }
  },
});

export const chatNewRoute = createRoute({
  getParentRoute: () => chatLayoutRoute,
  path: "/new",
  component: ChatPage,
});

export const chatConversationRoute = createRoute({
  getParentRoute: () => chatLayoutRoute,
  path: "/c/$id",
  component: ConversationPage,
});
