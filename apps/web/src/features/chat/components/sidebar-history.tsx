'use client';

// Placeholder data — replace with real API data
const RECENT_CHATS = [
  { id: '1', title: 'Build a sidebar component' },
  { id: '2', title: 'GitHub OAuth with NestJS' },
  { id: '3', title: 'Tailwind v4 config setup' },
  { id: '4', title: 'Zustand persistence pattern' },
  { id: '5', title: 'Next.js middleware auth' },
  { id: '6', title: 'Card component variants' },
  { id: '7', title: 'Feature architecture in React' },
];

export function SidebarHistory() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <p className="px-4 pt-4 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Recent
      </p>
      <ul className="flex flex-col overflow-y-auto px-2 pb-2 gap-0.5">
        {RECENT_CHATS.map(chat => (
          <li key={chat.id}>
            <button className="flex items-center gap-2.5 w-full rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-left group">
              <span className="truncate">{chat.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
