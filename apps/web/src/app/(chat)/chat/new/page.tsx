import { ChatPage } from '@/features/chat/components/chat-page';
import { chatMetadata } from '@/lib/metadata';

export const metadata = chatMetadata;

export default function Page() {
  return <ChatPage />;
}
