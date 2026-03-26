import { AuthGuard } from '@/features/auth/components/auth-guard';
import { ArtifactPanel } from '@/features/chat/components/artifact-panel';
import { ChatHeader } from '@/features/chat/components/chat-header';
import { Sidebar } from '@/features/chat/components/sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="grain-overlay" />
        <Sidebar />
        <div className="relative flex flex-1 overflow-hidden bg-background chat-bg">
          <div className="flex flex-1 flex-col overflow-hidden">
            <ChatHeader />
            <main className="flex flex-1 flex-col overflow-hidden" role="main">
              {children}
            </main>
          </div>
          <ArtifactPanel />
        </div>
      </div>
    </AuthGuard>
  );
}
