'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../lib/cn';

const cardVariants = cva(
  'rounded-lg transition-all duration-200 h-full flex flex-col justify-between',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border border-border shadow-sm',

        outline: 'bg-card text-card-foreground border-2 border-border shadow-none',
        ghost: 'bg-transparent text-card-foreground border-0 shadow-none',
      },

      gradient: {
        true: 'bg-gradient-to-br from-card to-card/80',
      },
    },
    defaultVariants: {
      variant: 'default',
      gradient: false,
    },
  },
);

const cardHeaderVariants = cva('flex flex-col space-y-1.5', {
  variants: {
    compact: {
      true: 'p-4',
      false: 'p-6',
    },
  },
  defaultVariants: {
    compact: false,
  },
});

const cardTitleVariants = cva('text-lg font-semibold leading-none tracking-tight');

const cardDescriptionVariants = cva('text-sm text-muted-foreground leading-relaxed');

const cardContentVariants = cva('flex-1', {
  variants: {
    compact: {
      true: 'p-4 pt-0',
      false: 'p-6 pt-0',
    },
  },
  defaultVariants: {
    compact: false,
  },
});

const cardFooterVariants = cva('flex items-center', {
  variants: {
    align: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    compact: {
      true: 'p-4 pt-0',
      false: 'p-6 pt-0',
    },
  },
  defaultVariants: {
    align: 'start',
    compact: false,
  },
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardHeaderVariants> {}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardContentVariants> {}

interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardFooterVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'default', gradient = false, as: Component = 'div', children, ...props },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant, gradient }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, compact, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardHeaderVariants({ compact }), className)} {...props}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn(cardTitleVariants(), className)} {...props}>
        {children}
      </Component>
    );
  },
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(cardDescriptionVariants(), className)} {...props}>
        {children}
      </p>
    );
  },
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, compact, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardContentVariants({ compact }), className)} {...props}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align, compact, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardFooterVariants({ align, compact }), className)} {...props}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardContent,
  cardContentVariants,
  CardDescription,
  cardDescriptionVariants,
  CardFooter,
  cardFooterVariants,
  CardHeader,
  cardHeaderVariants,
  CardTitle,
  cardTitleVariants,
  cardVariants,
};

export type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
};
