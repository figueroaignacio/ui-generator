import { AuthGuard } from '@/features/auth/components/auth-guard';
import { ChatHeader } from '@/features/chat/components/chat-header';
import { Sidebar } from '@/features/chat/components/sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-hidden bg-background chat-bg">
          <ChatHeader />
          <main className="flex flex-1 flex-col overflow-hidden" role="main">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
