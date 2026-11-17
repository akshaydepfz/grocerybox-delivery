"use client";

import { useState } from "react";

import { GroceryAnimatedLoader } from "@/components/shared/animated-loader";
import {
  useDeliveryOrder,
  useDeliveryOrders,
} from "@/features/delivery/hooks/use-delivery-orders";
import { DeliveryApiErrorBanner } from "@/features/dashboard/components/delivery-api-error-banner";
import type { DeliveryOrderStep } from "@/features/delivery/types/order";
import { cn } from "@/lib/utils";

import { DeliveryDetailPanel } from "./delivery-detail-panel";
import { SectionHeader } from "./section-header";

const TABS: { key: DeliveryOrderStep; label: string }[] = [
  { key: "out_for_delivery", label: "Active" },
  { key: "delivered", label: "Completed" },
];

export function DeliveriesScreen() {
  const [tab, setTab] = useState<DeliveryOrderStep>("out_for_delivery");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const ordersQuery = useDeliveryOrders(tab);
  const detailQuery = useDeliveryOrder(selectedOrderId);

  if (ordersQuery.isLoading) {
    return <GroceryAnimatedLoader label="Loading your deliveries" />;
  }

  const items = ordersQuery.data?.items ?? [];

  return (
    <div className="space-y-5">
      {ordersQuery.error ? (
        <DeliveryApiErrorBanner
          error={ordersQuery.error}
          onRetry={() => void ordersQuery.refetch()}
        />
      ) : null}

      <SectionHeader
        title="My deliveries"
        description="Orders assigned to you by your store"
      />

      <div className="flex gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
              tab === key
                ? "bg-[#16A34A] text-white"
                : "text-[#737B74] hover:bg-[#F0FDF4]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white px-4 py-12 text-center text-sm text-[#737B74]">
          No {tab === "delivered" ? "completed" : "active"} deliveries yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((order) => (
            <li key={order.id}>
              <button
                type="button"
                onClick={() => setSelectedOrderId(order.id)}
                className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#17211B]">
                      #{order.orderNumber}
                    </p>
                    <p className="mt-0.5 text-sm text-[#17211B]">
                      {order.customerName || "Customer"}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#737B74]">
                      {order.addressSummary}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#15803D]">₹{order.toPay}</p>
                    {order.commissionInr != null ? (
                      <p className="text-[11px] text-[#737B74]">
                        +₹{order.commissionInr} comm.
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <DeliveryDetailPanel
        order={detailQuery.data ?? null}
        onClose={() => setSelectedOrderId(null)}
        onCompleted={() => void ordersQuery.refetch()}
      />
    </div>
  );
}