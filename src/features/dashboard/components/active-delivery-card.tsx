"use client";

import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Navigation,
  Package,
  Phone,
  Store,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ActiveDelivery, DeliveryStatus } from "../types/dashboard";

const STEPS: { key: DeliveryStatus; label: string; short: string }[] = [
  { key: "assigned", label: "Assigned", short: "1" },
  { key: "picked_up", label: "Picked up", short: "2" },
  { key: "out_for_delivery", label: "En route", short: "3" },
  { key: "delivered", label: "Delivered", short: "4" },
];

const STATUS_BADGE: Record<DeliveryStatus, string> = {
  assigned: "Assigned",
  picked_up: "Picked up",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

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
    <section className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_16px_48px_rgba(23,33,27,0.08)]">
      <div className="border-b border-[#F0FDF4] bg-gradient-to-r from-[#F0FDF4] via-white to-white px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#16A34A] uppercase">
              Current delivery
            </p>
            <h3 className="mt-1 text-xl font-bold text-[#17211B]">
              #{delivery.id}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            <Truck className="size-3.5" aria-hidden />
            {STATUS_BADGE[delivery.status]}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <Chip>{delivery.distanceKm} km</Chip>
          <Chip>ETA {delivery.etaMinutes} min</Chip>
          <Chip variant="accent">Priority route</Chip>
        </div>

        <div className="relative space-y-4 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
          <RouteStop
            type="pickup"
            title={delivery.merchantName}
            subtitle={delivery.pickup}
          />
          <div className="flex items-center gap-2 pl-5 text-[#737B74]">
            <div className="h-px flex-1 border-t border-dashed border-[#D1D5DB]" />
            <ArrowRight className="size-4 shrink-0 text-[#16A34A]" />
            <span className="text-[11px] font-medium">{delivery.distanceKm} km</span>
          </div>
          <RouteStop
            type="drop"
            title={delivery.customerName}
            subtitle={delivery.dropoff}
            extra={delivery.customerPhone}
          />
        </div>

        <div className="overflow-x-auto pb-1">
          <ol className="flex min-w-[520px] items-center gap-0 lg:min-w-0">
            {STEPS.map((step, index) => {
              const done = index <= currentIndex;
              const active = index === currentIndex;
              return (
                <li key={step.key} className="flex flex-1 items-center">
                  <StepIndicator
                    done={done}
                    active={active}
                    label={step.label}
                    short={step.short}
                  />
                  {index < STEPS.length - 1 ? (
                    <div
                      className={cn(
                        "mx-1 h-0.5 flex-1 rounded-full",
                        index < currentIndex ? "bg-[#16A34A]" : "bg-[#E5E7EB]",
                      )}
                      aria-hidden
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="brand"
            className="h-12 rounded-xl text-base font-semibold"
            onClick={onViewDetails}
          >
            <Package className="size-4" />
            View delivery
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl border-[#E5E7EB] text-base"
            onClick={() =>
              toast.message("Navigation demo — GPS not connected in this preview.")
            }
          >
            <Navigation className="size-4" />
            Navigate
          </Button>
        </div>
      </div>
    </section>
  );
}

function StepIndicator({
  done,
  active,
  label,
  short,
}: {
  done: boolean;
  active: boolean;
  label: string;
  short: string;
}) {
  return (
    <div className="flex min-w-[72px] flex-col items-center gap-1.5">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-full text-xs font-bold",
          done
            ? "bg-[#16A34A] text-white"
            : "border border-[#E5E7EB] bg-white text-[#737B74]",
          active && "ring-4 ring-[#16A34A]/20",
        )}
      >
        {done && !active ? (
          <CheckCircle2 className="size-4" />
        ) : (
          short
        )}
      </span>
      <span
        className={cn(
          "text-center text-[10px] font-medium sm:text-[11px]",
          done ? "text-[#15803D]" : "text-[#737B74]",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function Chip({
  children,
  variant,
}: {
  children: ReactNode;
  variant?: "accent";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1",
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
    <div className="flex gap-3">
      <span
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
          isPickup
            ? "bg-[#F0FDF4] text-[#16A34A]"
            : "bg-[#ECFDF5] text-[#15803D]",
        )}
      >
        {isPickup ? (
          <Store className="size-4" aria-hidden />
        ) : (
          <MapPin className="size-4" aria-hidden />
        )}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#737B74]">
          {isPickup ? "Pickup" : "Drop-off"}
        </p>
        <p className="font-semibold text-[#17211B]">{title}</p>
        <p className="mt-0.5 text-sm text-[#737B74]">{subtitle}</p>
        {extra ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#737B74]">
            <Phone className="size-3" />
            {extra}
          </p>
        ) : null}
      </div>
    </div>
  );
}