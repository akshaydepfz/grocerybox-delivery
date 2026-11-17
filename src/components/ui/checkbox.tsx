"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(23,33,27,0.04)] transition-shadow outline-none",
        "focus-visible:border-[#16A34A] focus-visible:ring-[3px] focus-visible:ring-[#16A34A]/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-[#16A34A] data-[state=checked]:bg-[#16A34A] data-[state=checked]:text-white",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-content-center text-current">
        <CheckIcon className="size-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };