import * as React from "react";

import { cn } from "@/lib/cn";

type CardProps<T extends React.ElementType = "div"> = {
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

export default function Card<T extends React.ElementType = "div">({ as, className, ...props }: CardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "rounded-lg border border-border bg-surface shadow-card",
        className,
      )}
      {...props}
    />
  );
}
