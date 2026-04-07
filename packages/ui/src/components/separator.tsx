import * as React from "react";
import { cn } from "../lib/cn";

type SeparatorOrientation = "horizontal" | "vertical";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  label?: string;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  label,
  ref,
  ...props
}: SeparatorProps) {
  const semanticProps = decorative
    ? { role: "none" as const }
    : { role: "separator" as const, "aria-orientation": orientation };

  if (label) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3",
          orientation === "vertical" && "flex-col",
          className,
        )}
        {...semanticProps}
        {...props}>
        <span
          className={cn(
            "bg-border shrink-0",
            orientation === "horizontal" ? "h-px flex-1" : "w-px flex-1",
          )}
        />
        <span className="text-muted-foreground shrink-0 text-xs font-medium">
          {label}
        </span>
        <span
          className={cn(
            "bg-border shrink-0",
            orientation === "horizontal" ? "h-px flex-1" : "w-px flex-1",
          )}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...semanticProps}
      {...props}
    />
  );
}

Separator.displayName = "Separator";

export { Separator };
export type { SeparatorProps };
