"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

import { cn } from "@/lib/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
  size?: "default" | "sm";
  "aria-label"?: string;
}

export default function Select({ value, onValueChange, options, label, className, size = "default", ...rest }: SelectProps) {
  const selected = options.find((option) => option.value === value);

  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "inline-flex items-center justify-between gap-2 rounded-md border border-border-strong bg-surface font-medium text-ink outline-none transition-colors hover:bg-surface-raised focus:ring-2 focus:ring-accent/10",
          size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 px-3.5 text-sm",
          className,
        )}
        aria-label={rest["aria-label"]}
      >
        <span className="flex items-center gap-2 truncate">
          {label ? <span className="text-ink-faint">{label}</span> : null}
          <SelectPrimitive.Value>{selected?.label}</SelectPrimitive.Value>
        </span>
        <SelectPrimitive.Icon>
          <IconChevronDown className={cn("shrink-0 text-ink-faint", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} stroke={1.75} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-border-strong bg-surface shadow-raised"
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-sm text-ink outline-none transition-colors data-[highlighted]:bg-surface-raised data-[state=checked]:font-medium"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <IconCheck className="h-4 w-4 text-ink" stroke={1.75} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
