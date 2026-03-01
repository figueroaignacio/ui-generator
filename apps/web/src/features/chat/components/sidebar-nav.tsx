import { Chat01Icon, PencilEdit01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { motion, useReducedMotion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarNavProps {
  collapsed: boolean;
  onAction?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

const springTransition = { type: 'spring' as const, stiffness: 400, damping: 25 };

const items = [
  {
    icon: Search01Icon,
    label: 'Search',
    href: '/chat/search',
  },
  {
    icon: PencilEdit01Icon,
    label: 'New Conversation',
    href: '/chat/new',
  },
  {
    icon: Chat01Icon,
    label: 'Chats',
    href: '/chat/all',
  },
];

export function SidebarNav({ collapsed, onAction }: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const handleAction = (cb: () => void) => {
    cb();
    onAction?.();
  };

  return (
    <motion.nav
      className="flex flex-col gap-1 p-2"
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map(({ icon, label, href }) => {
        const isActive = pathname === href;
        return (
          <motion.button
            key={label}
            variants={shouldReduceMotion ? undefined : itemVariants}
            transition={springTransition}
            whileHover={shouldReduceMotion ? undefined : { x: 2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            onClick={() => handleAction(() => router.push(href))}
            title={collapsed ? label : undefined}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors group',
              isActive ? 'bg-card' : 'hover:bg-card text-muted-foreground hover:text-foreground',
              collapsed && 'justify-center px-0',
            )}
          >
            <HugeiconsIcon
              icon={icon}
              size={20}
              className={cn(
                'shrink-0 transition-transform group-hover:scale-110',
                isActive && 'scale-110',
                !collapsed && 'ml-0.5',
              )}
            />
            {!collapsed && <span className="truncate">{label}</span>}
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
