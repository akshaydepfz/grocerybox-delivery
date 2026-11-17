"use client";

import { Radio } from "lucide-react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type AvailabilityCardProps = {
  online: boolean;
  onOnlineChange: (online: boolean) => void;
};

export function AvailabilityCard({ online, onOnlineChange }: AvailabilityCardProps) {
  const handleToggle = (next: boolean) => {
    onOnlineChange(next);
    toast.success(next ? "You are now online" : "You are now offline");
  };

  return (
    <section
      className={cn(
        "rounded-2xl border p-5 shadow-[0_8px_30px_rgba(23,33,27,0.05)] transition-colors",
        online
          ? "border-[#bbf7d0] bg-gradient-to-br from-[#F0FDF4] to-white"
          : "border-[#E5E7EB] bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#737B74]">Your availability</p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                online
                  ? "bg-[#16A34A]/15 text-[#15803D]"
                  : "bg-[#F3F4F6] text-[#737B74]",
              )}
            >
              <Radio className="size-5" />
            </span>
            <p
              className={cn(
                "text-xl font-semibold tracking-tight",
                online ? "text-[#15803D]" : "text-[#17211B]",
              )}
            >
              {online ? "You're Online" : "You're Offline"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Switch
            checked={online}
            onCheckedChange={handleToggle}
            aria-label="Toggle online availability"
          />
          <span className="text-[11px] font-medium text-[#737B74]">
            {online ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </section>
  );
}