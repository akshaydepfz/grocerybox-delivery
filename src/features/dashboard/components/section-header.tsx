import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-4 flex items-end justify-between gap-3",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold tracking-tight text-[#17211B] sm:text-lg">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-xs leading-snug text-[#737B74] break-words sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}