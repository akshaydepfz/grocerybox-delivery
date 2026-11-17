"use client";

import { MapPin, Navigation, Phone, Store } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ActiveDelivery, DeliveryStatus } from "../types/dashboard";

const STEPS: { key: DeliveryStatus; label: string }[] = [
  { key: "assigned", label: "Order Assigned" },
  { key: "picked_up", label: "Picked Up" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

type ActiveDeliveryCardProps = {
  delivery: ActiveDelivery;
  onViewDetails: () => void;
};

export function ActiveDeliveryCard({
  delivery,
  onViewDetails,
}: ActiveDeliveryCardProps) {
  const currentIndex = STEPS.findIndex((step) => step.key === delivery.status);

  return (
    <section className="rounded-2xl border border-[#16A34A]/25 bg-gradient-to-br from-[#F0FDF4] via-white to-white p-5 shadow-[0_12px_40px_rgba(22,163,74,0.08)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#16A34A] uppercase">
            Current Delivery
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[#17211B]">
            Order #{delivery.id}
          </h3>
        </div>
        <span className="rounded-full bg-[#16A34A] px-3 py-1 text-xs font-semibold text-white">
          Out for Delivery
        </span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <InfoRow icon={Store} label="Merchant" value={delivery.merchantName} />
        <InfoRow icon={Phone} label="Customer" value={`${delivery.customerName} · ${delivery.customerPhone}`} />
        <InfoRow icon={MapPin} label="Pickup" value={delivery.pickup} />
        <InfoRow icon={MapPin} label="Drop-off" value={delivery.dropoff} />
      </dl>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#737B74]">
        <span>{delivery.distanceKm} km</span>
        <span>Est. {delivery.etaMinutes} min</span>
      </div>

      <ol className="mt-5 grid gap-2 sm:grid-cols-4">
        {STEPS.map((step, index) => {
          const done = index <= currentIndex;
          const active = index === currentIndex;
          return (
            <li
              key={step.key}
              className={cn(
                "rounded-xl border px-3 py-2 text-center text-[11px] font-medium",
                done
                  ? "border-[#bbf7d0] bg-[#F0FDF4] text-[#15803D]"
                  : "border-[#E5E7EB] bg-white text-[#737B74]",
                active && "ring-2 ring-[#16A34A]/20",
              )}
            >
              {step.label}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="brand"
          className="h-11 flex-1 rounded-xl"
          onClick={onViewDetails}
        >
          View Delivery
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 rounded-xl border-[#E5E7EB]"
          onClick={() =>
            toast.message("Navigation demo — GPS not connected in this preview.")
          }
        >
          <Navigation className="size-4" />
          Navigate
        </Button>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Store;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-[#16A34A]" aria-hidden />
      <div>
        <dt className="text-xs text-[#737B74]">{label}</dt>
        <dd className="font-medium text-[#17211B]">{value}</dd>
      </div>
    </div>
  );
}