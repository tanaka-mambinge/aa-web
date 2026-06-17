"use client";

import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import Select from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface ApprovalFilterSheetProps {
  statusOptions: FilterOption[];
  statusValue: string;
  onStatusChange: (value: string) => void;
  cliOptions: FilterOption[];
  cliValue: string;
  onCliChange: (value: string) => void;
  closeHref: string;
}

export default function ApprovalFilterSheet({
  statusOptions,
  statusValue,
  onStatusChange,
  cliOptions,
  cliValue,
  onCliChange,
  closeHref,
}: ApprovalFilterSheetProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Filters</h2>
        <button
          type="button"
          onClick={() => router.push(closeHref)}
          aria-label="Close filters"
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink"
        >
          <IconX className="h-5 w-5" stroke={1.75} />
        </button>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-ink">Status</h3>
          <Select
            aria-label="Filter by status"
            className="w-full"
            value={statusValue}
            onValueChange={onStatusChange}
            options={statusOptions}
          />
        </div>
        {cliOptions.length > 1 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-ink">Project</h3>
            <Select
              aria-label="Filter by project"
              className="w-full"
              value={cliValue}
              onValueChange={onCliChange}
              options={cliOptions}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
