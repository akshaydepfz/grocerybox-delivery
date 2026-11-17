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
      <div>
        <h2 className="text-base font-semibold tracking-tight text-[#17211B] sm:text-lg">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-sm text-[#737B74]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}