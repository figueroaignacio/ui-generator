import { ChatListView } from '@/features/chat/components/chat-list-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Chats | NachAI',
  description: 'Manage and search through all your past conversations.',
};

export default function AllChatsPage() {
  return <ChatListView />;
}
