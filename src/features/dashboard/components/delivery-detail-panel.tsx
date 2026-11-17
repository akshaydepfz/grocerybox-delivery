"use client";

import {
  Banknote,
  CheckCircle2,
  Loader2,
  Navigation,
  Phone,
  Smartphone,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCompleteDeliveryOrder } from "@/features/delivery/hooks/use-delivery-orders";
import type { DeliveryOrderDetail } from "@/features/delivery/types/order";
import {
  buildGoogleMapsDirectionsUrl,
  buildTelHref,
  resolveCustomerPhone,
} from "@/features/delivery/utils/delivery-contact-links";
import { isCodOrder } from "@/features/delivery/utils/parse-delivery-order";
import { cn } from "@/lib/utils";

type DeliveryDetailPanelProps = {
  order: DeliveryOrderDetail | null;
  onClose: () => void;
  onCompleted?: () => void;
};

export function DeliveryDetailPanel({
  order,
  onClose,
  onCompleted,
}: DeliveryDetailPanelProps) {
  const completeMutation = useCompleteDeliveryOrder();
  const [collectionMode, setCollectionMode] = useState<"cash" | "online" | null>(
    null,
  );

  const canComplete = useMemo(() => {
    if (!order) {
      return false;
    }
    return order.currentStep === "out_for_delivery";
  }, [order]);

  if (!order) {
    return null;
  }

  const cod = isCodOrder(order);
  const defaultMode = cod ? null : "online";
  const phone = resolveCustomerPhone(order.customerPhone, order.address);
  const telHref = buildTelHref(phone);
  const mapsHref = buildGoogleMapsDirectionsUrl(
    order.address,
    order.addressSummary,
  );

  const handleComplete = async () => {
    const mode = collectionMode ?? defaultMode;
    if (!mode) {
      toast.error("Select how payment was collected.");
      return;
    }
    try {
      const result = await completeMutation.mutateAsync({
        orderId: order.id,
        input: { collectionMode: mode },
      });
      toast.success(
        `Order delivered · Commission ₹${Math.round(result.commissionAmountInr)}`,
      );
      onCompleted?.();
      onClose();
    } catch {
      toast.error("Could not complete delivery. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#17211B]/40"
        aria-label="Close delivery details"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#16A34A]">
              Order detail
            </p>
            <h2 className="text-lg font-semibold text-[#17211B]">
              #{order.orderNumber}
            </h2>
            <p className="mt-0.5 text-xs text-[#737B74]">{order.paymentDisplay}</p>
          </div>
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
          <DetailRow label="Store" value={order.merchantStoreName} />
          <DetailRow label="Customer" value={order.customerName || "—"} />
          <DetailRow label="Phone" value={order.customerPhone || order.address.phone} />
          <DetailRow label="Drop-off" value={order.addressSummary} />
          <DetailRow label="Amount" value={`₹${order.toPay}`} />
          <DetailRow label="Status" value={formatStepLabel(order.currentStep)} />
          {order.commissionInr != null ? (
            <DetailRow label="Commission" value={`₹${order.commissionInr}`} />
          ) : null}
        </dl>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {telHref ? (
            <a
              href={telHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#17211B] transition-colors hover:border-[#86efac] hover:bg-[#F0FDF4]"
            >
              <Phone className="size-4 text-[#16A34A]" aria-hidden />
              Call customer
            </a>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-[#E5E7EB] text-sm"
              onClick={() => toast.message("No phone number on this order.")}
            >
              <Phone className="size-4" />
              Call customer
            </Button>
          )}
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#15803D]/30 bg-[#F0FDF4] text-sm font-semibold text-[#15803D] transition-colors hover:bg-[#DCFCE7]"
          >
            <Navigation className="size-4" aria-hidden />
            Directions
          </a>
        </div>

        {order.lines.length > 0 ? (
          <div className="mt-4 rounded-xl border border-[#F3F4F6] bg-[#FAFAFA] p-3">
            <p className="text-xs font-semibold text-[#17211B]">Items</p>
            <ul className="mt-2 space-y-1.5 text-xs text-[#737B74]">
              {order.lines.map((line) => (
                <li key={`${line.name}-${line.quantity}`} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">
                    {line.name} × {line.quantity} {line.unitLabel}
                  </span>
                  <span className="shrink-0 font-medium text-[#17211B]">
                    ₹{line.lineSellingTotal}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {canComplete ? (
          <div className="mt-5 space-y-3">
            <p className="text-sm font-semibold text-[#17211B]">Payment collected</p>
            {cod ? (
              <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
                <CollectionOption
                  selected={collectionMode === "cash"}
                  onClick={() => setCollectionMode("cash")}
                  icon={Banknote}
                  title="Cash"
                  subtitle="Collected COD in cash"
                />
                <CollectionOption
                  selected={collectionMode === "online"}
                  onClick={() => setCollectionMode("online")}
                  icon={Smartphone}
                  title="Online / UPI"
                  subtitle="Paid digitally at door"
                />
              </div>
            ) : (
              <p className="rounded-xl bg-[#F0FDF4] px-3 py-2 text-xs text-[#15803D]">
                Prepaid order — no cash collection needed.
              </p>
            )}

            <Button
              type="button"
              variant="brand"
              className="h-11 w-full rounded-xl font-semibold"
              disabled={completeMutation.isPending}
              onClick={() => void handleComplete()}
            >
              {completeMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              Mark delivered
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CollectionOption({
  selected,
  onClick,
  icon: Icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  icon: typeof Banknote;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-3 text-left transition-colors",
        selected
          ? "border-[#16A34A] bg-[#F0FDF4]"
          : "border-[#E5E7EB] bg-white hover:border-[#86efac]",
      )}
    >
      <Icon className={cn("size-4", selected ? "text-[#15803D]" : "text-[#737B74]")} />
      <p className="mt-2 text-sm font-semibold text-[#17211B]">{title}</p>
      <p className="mt-0.5 text-[11px] text-[#737B74]">{subtitle}</p>
    </button>
  );
}

function formatStepLabel(step: string): string {
  return step.replaceAll("_", " ");
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#F3F4F6] pb-2">
      <dt className="text-[#737B74]">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium text-[#17211B] break-words">
        {value}
      </dd>
    </div>
  );
}