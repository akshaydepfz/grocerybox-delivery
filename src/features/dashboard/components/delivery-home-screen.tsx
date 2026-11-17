"use client";

import { useMemo, useState } from "react";

import { GroceryAnimatedLoader } from "@/components/shared/animated-loader";
import { useAuth } from "@/features/auth/components/auth-provider";
import {
  useDeliveryOrder,
  useDeliveryOrders,
  useDeliveryPerformanceSummary,
} from "@/features/delivery/hooks/use-delivery-orders";
import type { DeliveryOrderListItem } from "@/features/delivery/types/order";

import { useMerchantStoreLabel } from "../hooks/use-merchant-store-label";
import type { PerformanceSnapshot, RecentDeliveryActivity } from "../types/dashboard";

import { ActiveDeliveryCard } from "./active-delivery-card";
import { AvailabilityCard } from "./availability-card";
import { DeliveryApiErrorBanner } from "./delivery-api-error-banner";
import { DeliveryDetailPanel } from "./delivery-detail-panel";
import { HomeHero } from "./home-hero";
import { PerformanceCards } from "./performance-cards";
import { RecentActivity } from "./recent-activity";
import { SectionHeader } from "./section-header";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

function toPerformanceSnapshot(
  summary: ReturnType<typeof useDeliveryPerformanceSummary>["data"],
): PerformanceSnapshot {
  return {
    todayDeliveries: summary?.todayDeliveries ?? 0,
    completed: summary?.completed ?? 0,
    pending: summary?.pending ?? 0,
    todayEarningsInr: Math.round(summary?.todayEarningsInr ?? 0),
  };
}

function toRecentActivity(items: DeliveryOrderListItem[]): RecentDeliveryActivity[] {
  return items.slice(0, 5).map((order) => ({
    id: order.orderNumber,
    customerName: order.customerName || "Customer",
    completedAt: formatRelativeTime(order.updatedAt),
    commissionInr: Math.round(order.commissionInr ?? 0),
  }));
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function DeliveryHomeScreen() {
  const { partner } = useAuth();
  const merchantStoreName = useMerchantStoreLabel();
  const [online, setOnline] = useState(true);
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

  const activeQuery = useDeliveryOrders("out_for_delivery");
  const recentQuery = useDeliveryOrders("delivered");
  const performanceQuery = useDeliveryPerformanceSummary();
  const detailQuery = useDeliveryOrder(detailOrderId);

  const firstName = useMemo(() => {
    const name = partner?.fullName ?? "Partner";
    return name.split(" ")[0] ?? name;
  }, [partner?.fullName]);

  const activeOrder = activeQuery.data?.items[0] ?? null;
  const otherActive = activeQuery.data?.items.slice(1) ?? [];
  const performance = toPerformanceSnapshot(performanceQuery.data);
  const recentActivity = toRecentActivity(recentQuery.data?.items ?? []);

  const isLoading =
    activeQuery.isLoading || performanceQuery.isLoading || recentQuery.isLoading;

  const loadError =
    activeQuery.error ?? performanceQuery.error ?? recentQuery.error ?? null;

  const retryAll = () => {
    void activeQuery.refetch();
    void performanceQuery.refetch();
    void recentQuery.refetch();
  };

  if (isLoading) {
    return <GroceryAnimatedLoader label="Loading deliveries" />;
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 pb-4 sm:space-y-6">
      {loadError ? (
        <DeliveryApiErrorBanner error={loadError} onRetry={retryAll} />
      ) : null}

      <HomeHero
        greeting={greeting()}
        firstName={firstName}
        storeName={merchantStoreName}
        online={online}
        performance={performance}
      />

      <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-12 lg:items-start">
        <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-8">
          <AvailabilityCard online={online} onOnlineChange={setOnline} />

          <section>
            <SectionHeader
              title="Active delivery"
              description={
                activeOrder
                  ? "Complete payment collection when you deliver"
                  : "No order out for delivery right now"
              }
            />
            {activeOrder ? (
              <ActiveDeliveryCard
                order={activeOrder}
                onViewDetails={() => setDetailOrderId(activeOrder.id)}
              />
            ) : (
              <EmptyActiveState storeName={merchantStoreName} />
            )}
          </section>

          {otherActive.length > 0 ? (
            <section>
              <SectionHeader
                title="More assigned"
                description={`${otherActive.length} additional ${otherActive.length === 1 ? "order" : "orders"} in queue`}
              />
              <div className="grid gap-3">
                {otherActive.map((order) => (
                  <QueuedOrderCard
                    key={order.id}
                    order={order}
                    onOpen={() => setDetailOrderId(order.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-4 lg:sticky lg:top-24">
          <section>
            <SectionHeader
              title="Today's numbers"
              description="From completed deliveries today"
            />
            <PerformanceCards data={performance} />
          </section>

          <RecentActivity items={recentActivity} />
        </aside>
      </div>

      <DeliveryDetailPanel
        order={detailQuery.data ?? null}
        onClose={() => setDetailOrderId(null)}
        onCompleted={() => {
          void activeQuery.refetch();
          void recentQuery.refetch();
          void performanceQuery.refetch();
        }}
      />
    </div>
  );
}

function EmptyActiveState({ storeName }: { storeName: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white px-4 py-10 text-center">
      <p className="text-base font-semibold text-[#17211B]">Nothing in progress</p>
      <p className="mt-1 text-sm text-[#737B74]">
        When {storeName} assigns you an order and marks it out for delivery, it
        will show up here.
      </p>
    </div>
  );
}

function QueuedOrderCard({
  order,
  onOpen,
}: {
  order: DeliveryOrderListItem;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <QueuedOrderSummary order={order} />
        <span className="rounded-lg bg-[#F0FDF4] px-2 py-1 text-xs font-bold text-[#15803D]">
          ₹{order.toPay}
        </span>
      </div>
    </button>
  );
}

function QueuedOrderSummary({ order }: { order: DeliveryOrderListItem }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[#17211B]">#{order.orderNumber}</p>
      <p className="mt-0.5 text-sm text-[#17211B]">{order.customerName || "Customer"}</p>
      <p className="mt-1 truncate text-xs text-[#737B74]">{order.addressSummary}</p>
    </div>
  );
}