'use client';

import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import * as React from 'react';
import { cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';

type DialogContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
};

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

const useDialogContext = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext debe usarse dentro de un DialogProvider');
  }
  return context;
};

interface DialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const id = React.useId();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }

      if (onOpenChange) {
        const newValue = typeof value === 'function' ? value(open) : value;
        onOpenChange(newValue);
      }
    },
    [isControlled, onOpenChange, open],
  );

  return <DialogContext.Provider value={{ open, setOpen, id }}>{children}</DialogContext.Provider>;
};

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(true);
      onClick?.(e);
    };

    if (asChild) {
      return cloneElement(props.children as React.ReactElement<any>, {
        onClick: handleClick,
      });
    }

    return <button type="button" onClick={handleClick} ref={ref} {...props} />;
  },
);
DialogTrigger.displayName = 'DialogTrigger';

interface DialogPortalProps {
  children: React.ReactNode;
}

const DialogPortal = ({ children }: DialogPortalProps) => {
  return createPortal(children, document.body);
};

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(false);
      onClick?.(e);
    };

    if (asChild) {
      return cloneElement(props.children as React.ReactElement<any>, {
        onClick: handleClick,
      });
    }

    return <button type="button" onClick={handleClick} ref={ref} {...props} />;
  },
);
DialogClose.displayName = 'DialogClose';

type DialogOverlayProps = HTMLMotionProps<'div'> & {
  className?: string;
};

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.3 }}
        className={cn('fixed inset-0 z-200 bg-background/50', className)}
        onClick={() => setOpen(false)}
        {...props}
      />
    );
  },
);
DialogOverlay.displayName = 'DialogOverlay';

type DialogContentProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  className?: string;
  children?: React.ReactNode;
};

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { id, open } = useDialogContext();

    return (
      <AnimatePresence mode="wait">
        {open && (
          <DialogPortal>
            <DialogOverlay />
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-title`}
              aria-describedby={`${id}-description`}
              onClick={e => e.stopPropagation()}
              initial={{
                opacity: 0,
                scale: 0.9,
                filter: 'blur(10px)',
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                filter: 'blur(10px)',
                y: 10,
                transition: { duration: 0.2, ease: 'easeIn' },
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 350,
                mass: 0.5,
              }}
              className={cn(
                'bg-background fixed top-[50%] left-[50%] z-500 grid w-full max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border p-6 shadow-lg',
                className,
              )}
              {...props}
            >
              {children}
              <DialogClose className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
                <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" size={16} />
                <span className="sr-only">Close</span>
              </DialogClose>
            </motion.div>
          </DialogPortal>
        )}
      </AnimatePresence>
    );
  },
);
DialogContent.displayName = 'DialogContent';

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    const { id } = useDialogContext();

    return (
      <h2
        id={`${id}-title`}
        ref={ref}
        className={cn('text-lg leading-none font-semibold tracking-tight', className)}
        {...props}
      />
    );
  },
);
DialogTitle.displayName = 'DialogTitle';

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => {
    const { id } = useDialogContext();

    return (
      <p
        id={`${id}-description`}
        ref={ref}
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
      />
    );
  },
);
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
