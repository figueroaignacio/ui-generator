import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  getConversation,
  getConversations,
} from "../api/conversations.api";

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string | undefined = undefined) =>
      createConversation(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => getConversation(id),
    enabled: !!id,
  });
}
