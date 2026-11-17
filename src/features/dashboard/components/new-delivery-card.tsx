"use client";

import { Clock, IndianRupee, MapPin, Route } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { NewDeliveryRequest } from "../types/dashboard";

type NewDeliveryCardProps = {
  request: NewDeliveryRequest;
  onAccept: () => void;
  onDecline: () => void;
};

export function NewDeliveryCard({
  request,
  onAccept,
  onDecline,
}: NewDeliveryCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_28px_rgba(23,33,27,0.06)] transition-shadow hover:shadow-[0_14px_36px_rgba(23,33,27,0.1)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#16A34A] via-[#22c55e] to-[#15803D]" />

      <div className="p-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-[#737B74] uppercase">
              New request
            </p>
            <p className="mt-0.5 text-lg font-bold text-[#17211B]">#{request.id}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-xl bg-[#F0FDF4] px-2.5 py-1.5 text-sm font-bold text-[#15803D]">
            <IndianRupee className="size-3.5" aria-hidden />
            {request.earningsInr}
          </span>
        </div>

        <p className="mt-3 text-sm font-semibold text-[#17211B]">
          {request.customerName}
        </p>

        <div className="mt-3 space-y-2.5 rounded-xl border border-[#F3F4F6] bg-[#FAFAFA] p-3 text-xs text-[#737B74]">
          <LocationRow label="Pickup" value={request.pickup} />
          <LocationRow label="Drop" value={request.dropoff} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <MetaPill icon={Route}>{request.distanceKm} km</MetaPill>
          <MetaPill icon={Clock}>~{Math.max(8, request.distanceKm * 4)} min</MetaPill>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-[#E5E7EB]"
            onClick={() => {
              onDecline();
              toast.message(`Declined order #${request.id} (demo)`);
            }}
          >
            Decline
          </Button>
          <Button
            type="button"
            variant="brand"
            className="h-11 rounded-xl font-semibold"
            onClick={() => {
              onAccept();
              toast.success(`Accepted order #${request.id} (demo)`);
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </article>
  );
}

function LocationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#16A34A]" aria-hidden />
      <span className="min-w-0">
        <span className="font-semibold text-[#17211B]">{label}</span>
        <span className="text-[#737B74]"> · {value}</span>
      </span>
    </div>
  );
}

function MetaPill({
  icon: Icon,
  children,
}: {
  icon: typeof Route;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#737B74] ring-1 ring-[#E5E7EB]">
      <Icon className="size-3 text-[#16A34A]" aria-hidden />
      {children}
    </span>
  );
}