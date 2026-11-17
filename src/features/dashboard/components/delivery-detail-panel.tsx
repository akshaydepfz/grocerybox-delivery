"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ActiveDelivery } from "../types/dashboard";

type DeliveryDetailPanelProps = {
  delivery: ActiveDelivery | null;
  onClose: () => void;
};

export function DeliveryDetailPanel({
  delivery,
  onClose,
}: DeliveryDetailPanelProps) {
  if (!delivery) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#17211B]/40"
        aria-label="Close delivery details"
        onClick={onClose}
      />
      <div className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#17211B]">
            Order #{delivery.id}
          </h2>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </div>
        <dl className="space-y-3 text-sm">
          <DetailRow label="Merchant" value={delivery.merchantName} />
          <DetailRow label="Customer" value={delivery.customerName} />
          <DetailRow label="Phone" value={delivery.customerPhone} />
          <DetailRow label="Pickup" value={delivery.pickup} />
          <DetailRow label="Drop-off" value={delivery.dropoff} />
          <DetailRow label="Distance" value={`${delivery.distanceKm} km`} />
          <DetailRow label="ETA" value={`${delivery.etaMinutes} minutes`} />
          <DetailRow label="Status" value="Out for Delivery" />
        </dl>
        <p className="mt-4 rounded-xl bg-[#F0FDF4] px-3 py-2 text-xs text-[#737B74]">
          UI preview only — order details are sample mock data.
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#F3F4F6] pb-2">
      <dt className="text-[#737B74]">{label}</dt>
      <dd className="text-right font-medium text-[#17211B]">{value}</dd>
    </div>
  );
}