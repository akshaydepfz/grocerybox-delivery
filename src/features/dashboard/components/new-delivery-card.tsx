"use client";

import { MapPin } from "lucide-react";
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
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_4px_20px_rgba(23,33,27,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[#17211B]">#{request.id}</p>
        <p className="text-sm font-semibold text-[#16A34A]">₹{request.earningsInr}</p>
      </div>
      <p className="mt-2 text-sm font-medium text-[#17211B]">{request.customerName}</p>
      <div className="mt-3 space-y-2 text-xs text-[#737B74]">
        <LocationRow label="Pickup" value={request.pickup} />
        <LocationRow label="Drop" value={request.dropoff} />
      </div>
      <p className="mt-2 text-xs text-[#737B74]">{request.distanceKm} km</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl border-[#E5E7EB]"
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
          className="h-10 rounded-xl"
          onClick={() => {
            onAccept();
            toast.success(`Accepted order #${request.id} (demo)`);
          }}
        >
          Accept
        </Button>
      </div>
    </article>
  );
}

function LocationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <MapPin className="size-3.5 shrink-0 text-[#16A34A]" aria-hidden />
      <span>
        <span className="font-medium text-[#17211B]">{label}:</span> {value}
      </span>
    </div>
  );
}