import { AuthGuard } from '@/features/auth/components/auth-guard';
import { Sidebar } from '@/features/chat/components/sidebar';
import { UserMenu } from '@/features/chat/components/user-menu';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Mobile header bar — gives content breathing room and holds the avatar */}
          <header className="flex md:hidden items-center justify-between border-b border-border/50 px-4 h-14 shrink-0">
            {/* Left spacer — the hamburger button is fixed inside <Sidebar /> */}
            <div className="w-8" />
            <UserMenu />
          </header>

          {/* Desktop: floating avatar top-right */}
          <div className="hidden md:block absolute top-3 right-4 z-30">
            <UserMenu />
          </div>

          <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
