import { AppSidebar } from "@/modules/chat/components/app-sidebar";
import { MobileHeader } from "@/modules/chat/components/mobile-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <div className="flex-1 overflow-y-auto mx-5 my-3.5">{children}</div>
      </div>
    </div>
  );
}
