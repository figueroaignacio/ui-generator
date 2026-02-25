import { ChatListView } from '@/features/chat/components/chat-list-view';
import { allChatsMetadata } from '@/lib/metadata';

export const metadata = allChatsMetadata;

export default function AllChatsPage() {
  return <ChatListView />;
}
