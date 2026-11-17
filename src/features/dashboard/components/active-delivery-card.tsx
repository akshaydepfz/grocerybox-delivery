"use client";

import {
  CheckCircle2,
  MapPin,
  Package,
  Phone,
  Store,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DeliveryOrderListItem } from "@/features/delivery/types/order";
import { buildPickupLabel } from "@/features/delivery/utils/map-order-to-active";
import { isCodOrder } from "@/features/delivery/utils/parse-delivery-order";
import { cn } from "@/lib/utils";

type ActiveDeliveryCardProps = {
  order: DeliveryOrderListItem;
  onViewDetails: () => void;
};

const STEPS = [
  { key: "assigned", label: "Assigned", shortLabel: "Assigned", short: "1" },
  { key: "picked_up", label: "Picked up", shortLabel: "Picked", short: "2" },
  { key: "out_for_delivery", label: "En route", shortLabel: "En route", short: "3" },
  { key: "delivered", label: "Delivered", shortLabel: "Done", short: "4" },
] as const;

export function ActiveDeliveryCard({ order, onViewDetails }: ActiveDeliveryCardProps) {
  const currentIndex = STEPS.findIndex((step) => step.key === "out_for_delivery");
  const pickup = buildPickupLabel(order.merchantStoreName, order.fulfillmentHub);
  const cod = isCodOrder(order);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_16px_48px_rgba(23,33,27,0.08)] sm:rounded-3xl">
      <div className="border-b border-[#F0FDF4] bg-gradient-to-r from-[#F0FDF4] via-white to-white px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#16A34A] uppercase sm:text-[11px]">
              Current delivery
            </p>
            <h3 className="mt-1 text-lg font-bold text-[#17211B] sm:text-xl">
              #{order.orderNumber}
            </h3>
          </div>
          <span className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-full bg-[#16A34A] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm sm:px-3 sm:py-1.5 sm:text-xs">
            <Truck className="size-3.5 shrink-0" aria-hidden />
            Out for delivery
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:space-y-5 sm:p-5">
        <div className="flex flex-wrap gap-1.5 text-[11px] font-medium sm:gap-2 sm:text-xs">
          <Chip variant="accent">Collect ₹{order.toPay}</Chip>
          <Chip>{cod ? "Cash on delivery" : "Prepaid"}</Chip>
          {order.deliveryLabel ? <Chip>{order.deliveryLabel}</Chip> : null}
        </div>

        <div className="relative space-y-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3 sm:space-y-4 sm:rounded-2xl sm:p-4">
          <RouteStop type="pickup" title={order.merchantStoreName} subtitle={pickup} />
          <RouteStop
            type="drop"
            title={order.customerName || "Customer"}
            subtitle={order.addressSummary}
            extra={order.customerPhone}
          />
        </div>

        <ol className="grid w-full grid-cols-4 gap-0.5 sm:gap-1">
          {STEPS.map((step, index) => {
            const done = index <= currentIndex;
            const active = index === currentIndex;
            return (
              <li key={step.key} className="min-w-0">
                <StepIndicator
                  done={done}
                  active={active}
                  label={step.label}
                  shortLabel={step.shortLabel}
                  short={step.short}
                />
              </li>
            );
          })}
        </ol>

        <Button
          type="button"
          variant="brand"
          className="h-11 w-full rounded-xl text-sm font-semibold sm:h-12 sm:text-base"
          onClick={onViewDetails}
        >
          <Package className="size-4" />
          View &amp; complete delivery
        </Button>
      </div>
    </section>
  );
}

function StepIndicator({
  done,
  active,
  label,
  shortLabel,
  short,
}: {
  done: boolean;
  active: boolean;
  label: string;
  shortLabel: string;
  short: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1 px-0.5 sm:gap-1.5 sm:px-1">
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full text-[10px] font-bold sm:size-8 sm:text-xs",
          done
            ? "bg-[#16A34A] text-white"
            : "border border-[#E5E7EB] bg-white text-[#737B74]",
          active && "ring-2 ring-[#16A34A]/25 sm:ring-4 sm:ring-[#16A34A]/20",
        )}
      >
        {done && !active ? (
          <CheckCircle2 className="size-3.5 sm:size-4" />
        ) : (
          short
        )}
      </span>
      <span
        className={cn(
          "w-full text-center text-[9px] leading-tight font-medium sm:text-[11px]",
          done ? "text-[#15803D]" : "text-[#737B74]",
        )}
      >
        <span className="sm:hidden">{shortLabel}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
    </div>
  );
}

function Chip({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full truncate rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1",
        variant === "accent"
          ? "bg-[#F0FDF4] text-[#15803D]"
          : "bg-white text-[#737B74] ring-1 ring-[#E5E7EB]",
      )}
    >
      {children}
    </span>
  );
}

function RouteStop({
  type,
  title,
  subtitle,
  extra,
}: {
  type: "pickup" | "drop";
  title: string;
  subtitle: string;
  extra?: string;
}) {
  const isPickup = type === "pickup";
  return (
    <div className="flex min-w-0 gap-2.5 sm:gap-3">
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9 sm:rounded-xl",
          isPickup
            ? "bg-[#F0FDF4] text-[#16A34A]"
            : "bg-[#ECFDF5] text-[#15803D]",
        )}
      >
        {isPickup ? (
          <Store className="size-3.5 sm:size-4" aria-hidden />
        ) : (
          <MapPin className="size-3.5 sm:size-4" aria-hidden />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-wide text-[#737B74] uppercase sm:text-[11px]">
          {isPickup ? "Pickup" : "Drop-off"}
        </p>
        <p className="truncate font-semibold text-[#17211B]">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-[#737B74] break-words sm:text-sm">
          {subtitle}
        </p>
        {extra ? (
          <p className="mt-1 flex min-w-0 items-center gap-1 text-xs text-[#737B74]">
            <Phone className="size-3 shrink-0" />
            <span className="truncate">{extra}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}