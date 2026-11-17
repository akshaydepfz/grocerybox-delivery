import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-base text-[#17211B] shadow-[0_1px_2px_rgba(23,33,27,0.04)] transition-[border-color,box-shadow] outline-none",
        "placeholder:text-[#737B74] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#16A34A] focus-visible:ring-[3px] focus-visible:ring-[#16A34A]/20",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/15",
        className,
      )}
      {...props}
    />
  );
}

type InputWithIconProps = React.ComponentProps<"input"> & {
  leadingIcon: React.ReactNode;
  containerClassName?: string;
};

function InputWithIcon({
  leadingIcon,
  className,
  containerClassName,
  ...props
}: InputWithIconProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <span
        className="pointer-events-none absolute top-1/2 left-3.5 flex -translate-y-1/2 text-[#737B74]"
        aria-hidden
      >
        {leadingIcon}
      </span>
      <Input className={cn("pl-11", className)} {...props} />
    </div>
  );
}

export { Input, InputWithIcon };