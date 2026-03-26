import {
  Alert02Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/cn';

const calloutVariants = cva('flex w-full items-start gap-3 rounded-xl border p-4 text-sm', {
  variants: {
    variant: {
      default: 'bg-card/50 text-card-foreground border-border',
      info: 'bg-info/10 text-info border-info/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      danger: 'bg-destructive/10 text-destructive border-destructive/20',
      success: 'bg-success/10 text-success border-success/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof calloutVariants> {
  icon?: React.ReactNode;
  title?: string;
}

const CalloutTitle = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    className={cn('leading-none font-semibold tracking-tight', className)}
    {...props}
  />
);
CalloutTitle.displayName = 'CalloutTitle';

const CalloutContent = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    className={cn('text-muted-foreground/90 [&_p]:leading-relaxed', className)}
    {...props}
  />
);
CalloutContent.displayName = 'CalloutContent';

const CalloutIcon = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn('mt-0.5 shrink-0 text-base select-none', className)}
    {...props}
  />
);
CalloutIcon.displayName = 'CalloutIcon';

const CalloutRoot = ({
  className,
  variant,
  icon,
  title,
  children,
  ref,
  ...props
}: CalloutProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case 'info':
        return <HugeiconsIcon icon={InformationCircleIcon} size={18} />;
      case 'warning':
        return <HugeiconsIcon icon={Alert02Icon} size={18} />;
      case 'danger':
        return <HugeiconsIcon icon={AlertCircleIcon} size={18} />;
      case 'success':
        return <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />;
      default:
        return null;
    }
  };

  const calloutIcon = getIcon();
  const role = variant === 'danger' || variant === 'warning' ? 'alert' : 'region';

  return (
    <div ref={ref} role={role} className={cn(calloutVariants({ variant }), className)} {...props}>
      {calloutIcon ? <CalloutIcon>{calloutIcon}</CalloutIcon> : null}
      <div className="flex-1 space-y-1">
        {title ? <CalloutTitle>{title}</CalloutTitle> : null}
        <CalloutContent>{children}</CalloutContent>
      </div>
    </div>
  );
};

CalloutRoot.displayName = 'Callout';

const Callout = Object.assign(CalloutRoot, {
  Title: CalloutTitle,
  Content: CalloutContent,
  Icon: CalloutIcon,
});

export { Callout, calloutVariants };
export type { CalloutProps };
