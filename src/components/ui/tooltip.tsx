"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/cn";

interface TooltipProps {
  label: string;
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
}

export default function Tooltip({ label, children, side = "top" }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={10}
            className={cn(
              "z-50 scale-95 rounded-md border border-border-strong bg-ink px-2.5 py-1.5 text-xs font-medium text-canvas opacity-0 shadow-raised transition-[opacity,transform] duration-150 ease-out",
              "data-[state=delayed-open]:scale-100 data-[state=delayed-open]:opacity-100",
              "data-[state=instant-open]:scale-100 data-[state=instant-open]:opacity-100",
            )}
          >
            {label}
            <TooltipPrimitive.Arrow className="fill-ink" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
