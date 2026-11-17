"use client";

import { useState } from "react";
import { Banknote, IndianRupee, Smartphone, TrendingUp } from "lucide-react";

import { GroceryAnimatedLoader } from "@/components/shared/animated-loader";
import { DeliveryApiErrorBanner } from "@/features/dashboard/components/delivery-api-error-banner";
import { SectionHeader } from "@/features/dashboard/components/section-header";
import { useDeliveryEarnings } from "@/features/delivery/hooks/use-delivery-orders";
import type { EarningsPeriod } from "@/features/delivery/types/earnings";
import { formatEarningsDate } from "@/features/delivery/utils/parse-delivery-earnings";
import { cn } from "@/lib/utils";

const PERIOD_TABS: { key: EarningsPeriod; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "7 days" },
  { key: "month", label: "This month" },
  { key: "all", label: "All time" },
];

export function EarningsScreen() {
  const [period, setPeriod] = useState<EarningsPeriod>("month");
  const earningsQuery = useDeliveryEarnings(period);

  if (earningsQuery.isLoading) {
    return <GroceryAnimatedLoader label="Loading earnings" />;
  }

  const summary = earningsQuery.data?.summary;
  const items = earningsQuery.data?.items ?? [];

  return (
    <div className="space-y-5 pb-4">
      {earningsQuery.error ? (
        <DeliveryApiErrorBanner
          error={earningsQuery.error}
          onRetry={() => void earningsQuery.refetch()}
        />
      ) : null}

      <SectionHeader
        title="Earnings"
        description="Commissions from completed deliveries"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {PERIOD_TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriod(key)}
            className={cn(
              "shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors",
              period === key
                ? "bg-[#16A34A] text-white"
                : "bg-white text-[#737B74] ring-1 ring-[#E5E7EB] hover:bg-[#F0FDF4]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-[#15803D]/20 bg-gradient-to-br from-[#15803D] to-[#16A34A] p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 text-white/85">
            <IndianRupee className="size-4" aria-hidden />
            <span className="text-xs font-medium uppercase tracking-wide">
              Period total
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            ₹{Math.round(summary?.totalCommissionInr ?? 0)}
          </p>
          <p className="mt-1 text-xs text-white/80">
            {summary?.deliveryCount ?? 0}{" "}
            {(summary?.deliveryCount ?? 0) === 1 ? "delivery" : "deliveries"}
          </p>
        </article>

        <article className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#737B74]">
            <TrendingUp className="size-4 text-[#16A34A]" aria-hidden />
            <span className="text-xs font-medium uppercase tracking-wide">
              Lifetime
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#17211B]">
            ₹{Math.round(summary?.lifetimeEarningsInr ?? 0)}
          </p>
          <p className="mt-1 text-xs text-[#737B74]">Total commission earned</p>
        </article>
      </div>

      <section>
        <h2 className="mb-3 text-base font-semibold text-[#17211B]">
          Commission history
        </h2>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white px-4 py-12 text-center text-sm text-[#737B74]">
            No commissions in this period yet. Complete a delivery to earn here.
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm sm:p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
                    {item.collectionMode === "cash" ? (
                      <Banknote className="size-5" aria-hidden />
                    ) : (
                      <Smartphone className="size-5" aria-hidden />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#17211B]">
                      #{item.orderNumber}
                    </p>
                    <p className="text-xs text-[#737B74]">
                      {formatEarningsDate(item.deliveredAt)} ·{" "}
                      {item.collectionMode === "cash" ? "Cash" : "Online"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#15803D]">
                      +₹{Math.round(item.commissionAmountInr)}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-[#737B74]">
                      {item.commissionType}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}