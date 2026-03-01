import { ConversationPage } from '@/features/chat/components/conversation-page';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ConversationPage id={id} />;
}
