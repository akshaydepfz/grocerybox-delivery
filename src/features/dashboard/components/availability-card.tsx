"use client";

import { Bike, Radio, Wifi, WifiOff } from "lucide-react";
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
        "relative w-full min-w-0 overflow-hidden rounded-2xl border p-4 transition-all sm:p-5",
        online
          ? "border-[#86efac] bg-white shadow-[0_12px_40px_rgba(22,163,74,0.12)]"
          : "border-[#E5E7EB] bg-[#FAFAFA] shadow-sm",
      )}
    >
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <div
          className={cn(
            "relative flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-14 sm:rounded-2xl",
            online
              ? "bg-[#F0FDF4] text-[#16A34A]"
              : "bg-white text-[#737B74] shadow-sm",
          )}
        >
          {online ? (
            <Bike className="size-7" aria-hidden />
          ) : (
            <Radio className="size-6" aria-hidden />
          )}
          {online ? (
            <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-[#16A34A]">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#16A34A] opacity-60" />
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-[#737B74] uppercase">
            Your availability
          </p>
          <p
            className={cn(
              "mt-0.5 text-base font-semibold sm:text-lg",
              online ? "text-[#15803D]" : "text-[#17211B]",
            )}
          >
            {online ? "You're Online" : "You're Offline"}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#737B74]">
            {online ? (
              <Wifi className="size-3.5 text-[#16A34A]" />
            ) : (
              <WifiOff className="size-3.5" />
            )}
            {online
              ? "You'll receive new delivery requests"
              : "Turn on to start receiving orders"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Switch
            checked={online}
            onCheckedChange={handleToggle}
            aria-label="Toggle online availability"
          />
          <span className="text-[10px] font-semibold text-[#737B74]">
            {online ? "ON" : "OFF"}
          </span>
        </div>
      </div>
    </section>
  );
}