'use client';

import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

// --- Interfaces ---

interface DropdownContextValue {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  triggerId: string;
  contentId: string;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  disabled?: boolean;
  onSelect?: () => void;
  variant?: 'default' | 'destructive';
  asChild?: boolean;
}

// --- Animation constants (module level) ---

const DROPDOWN_ICON_VARIANTS = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
} as const;

const DROPDOWN_ICON_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 } as const;
const DROPDOWN_ICON_STYLE = { willChange: 'transform' } as const;
const DROPDOWN_CONTENT_STYLE = { willChange: 'opacity, transform, filter' } as const;

// --- Context ---

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

const useDropdownContext = (): DropdownContextValue => {
  const context = React.use(DropdownContext);
  if (!context) throw new Error('Dropdown components must be used within DropdownMenu');
  return context;
};

// --- Helpers ---

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean,
) {
  React.useEffect(() => {
    if (!enabled) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        ref.current?.contains(event.target as Node) ||
        triggerRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, triggerRef, handler, enabled]);
}

// --- Components ---

function DropdownMenu({
  children,
  className,
  defaultOpen = false,
  onOpenChange,
}: DropdownMenuProps): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const openMenu = React.useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const toggleMenu = React.useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  }, [onOpenChange]);

  const id = React.useId();
  const triggerId = `dropdown-trigger-${id}`;
  const contentId = `dropdown-content-${id}`;

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      triggerRef,
      triggerId,
      contentId,
    }),
    [isOpen, openMenu, closeMenu, toggleMenu, triggerId, contentId],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div className={cn('relative inline-block text-left', className)}>{children}</div>
    </DropdownContext.Provider>
  );
}

function DropdownMenuTrigger({
  children,
  onClick,
  className,
  asChild = false,
}: DropdownMenuTriggerProps): React.JSX.Element {
  const { isOpen, toggleMenu, triggerRef, triggerId, contentId } = useDropdownContext();
  const shouldReduceMotion = useReducedMotion();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      toggleMenu();
      onClick?.(e);
    },
    [toggleMenu, onClick],
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      'aria-expanded': isOpen,
      'aria-haspopup': 'menu' as const,
      'aria-controls': contentId,
      id: triggerId,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <motion.button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
        'text-foreground border-border border',
        'hover:bg-muted transition-colors',
        'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
        className,
      )}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      aria-controls={contentId}
      id={triggerId}
    >
      {children}
      <motion.span
        variants={DROPDOWN_ICON_VARIANTS}
        animate={isOpen ? 'open' : 'closed'}
        transition={DROPDOWN_ICON_TRANSITION}
        style={DROPDOWN_ICON_STYLE}
      >
        <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 opacity-50" size={16} />
      </motion.span>
    </motion.button>
  );
}

function DropdownMenuContent({
  children,
  className,
  align = 'start',
  sideOffset = 6,
}: DropdownMenuContentProps): React.JSX.Element | null {
  const { isOpen, closeMenu, contentId, triggerId, triggerRef } = useDropdownContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<'bottom' | 'top'>('bottom');

  useClickOutside(contentRef, triggerRef, closeMenu, isOpen);

  React.useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const contentHeight = contentRef.current?.offsetHeight || 200;
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - triggerRect.bottom;

      const newPosition = spaceBelow < contentHeight + 20 ? 'top' : 'bottom';
      setPosition(newPosition);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, triggerRef]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  const alignClasses = {
    start: 'left-0 origin-top-left',
    center: 'left-1/2 -translate-x-1/2 origin-top',
    end: 'right-0 origin-top-right',
  };

  const transformOriginClass =
    position === 'bottom'
      ? align === 'start'
        ? 'origin-top-left'
        : align === 'end'
          ? 'origin-top-right'
          : 'origin-top'
      : align === 'start'
        ? 'origin-bottom-left'
        : align === 'end'
          ? 'origin-bottom-right'
          : 'origin-bottom';

  const verticalStyle =
    position === 'bottom'
      ? { top: `calc(100% + ${sideOffset}px)` }
      : { bottom: `calc(100% + ${sideOffset}px)` };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          id={contentId}
          role="menu"
          aria-labelledby={triggerId}
          initial={{
            opacity: 0,
            scale: 0.95,
            y: position === 'bottom' ? -8 : 8,
            filter: 'blur(4px)',
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
              type: 'spring',
              duration: 0.3,
              bounce: 0,
              opacity: { duration: 0.2 },
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            y: position === 'bottom' ? -4 : 4,
            filter: 'blur(2px)',
            transition: { duration: 0.15 },
          }}
          style={{ ...verticalStyle, ...DROPDOWN_CONTENT_STYLE }}
          className={cn(
            'border-border absolute z-50 min-w-48 overflow-hidden rounded-md border',
            'bg-background backdrop-blur-lg',
            alignClasses[align].split(' ')[0],
            transformOriginClass,
            className,
          )}
        >
          <div className="flex flex-col gap-0.5 p-1.5">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DropdownMenuItem({
  children,
  onClick,
  className,
  disabled = false,
  variant = 'default',
  onSelect,
  asChild = false,
}: DropdownMenuItemProps): React.JSX.Element {
  const { closeMenu } = useDropdownContext();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.stopPropagation();
      onClick?.(e as any);
      onSelect?.();
      closeMenu();
    },
    [disabled, onClick, onSelect, closeMenu],
  );

  const style = {
    '--accent': variant === 'destructive' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0, 0.04)',
  } as React.CSSProperties;

  const content = (
    <motion.div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      whileHover={!disabled ? { backgroundColor: 'var(--accent)', scale: 1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(
        'relative flex cursor-pointer items-center rounded-md px-3 py-2 text-sm outline-none select-none',
        'transition-colors duration-200',
        disabled && 'pointer-events-none opacity-50',
        variant === 'destructive' && 'text-destructive focus:text-destructive',
        className,
      )}
      style={style}
    >
      {children}
    </motion.div>
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      className: cn(
        'relative flex cursor-pointer items-center rounded-md px-3 py-2 text-sm outline-none select-none',
        'transition-colors duration-200',
        disabled && 'pointer-events-none opacity-50',
        variant === 'destructive' && 'text-destructive focus:text-destructive',
        className,
        (children.props as any).className,
      ),
      style: { ...style, ...(children.props as any).style },
    } as any);
  }

  return content;
}

function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground px-3 py-2 text-xs font-semibold tracking-wider uppercase">
      {children}
    </div>
  );
}

function DropdownSeparator() {
  return <div className="bg-border/50 my-1 h-px" />;
}

export {
  DropdownLabel,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownSeparator,
};
export type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuProps,
  DropdownMenuTriggerProps,
};
