import { CheckCircle2, Clock3, IndianRupee, Package, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

import type { PerformanceSnapshot } from "../types/dashboard";

type PerformanceCardsProps = {
  data: PerformanceSnapshot;
};

const statCards = [
  {
    key: "todayDeliveries" as const,
    label: "Today's deliveries",
    shortLabel: "Today",
    icon: Package,
    hint: "Assigned today",
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "completed" as const,
    label: "Completed",
    shortLabel: "Done",
    icon: CheckCircle2,
    hint: "Successfully delivered",
    accent: "bg-green-50 text-green-700",
  },
  {
    key: "pending" as const,
    label: "Pending",
    shortLabel: "Pending",
    icon: Clock3,
    hint: "Still in progress",
    accent: "bg-amber-50 text-amber-700",
  },
];

export function PerformanceCards({ data }: PerformanceCardsProps) {
  return (
    <section className="grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-2 lg:gap-3">
      {statCards.map(({ key, label, shortLabel, icon: Icon, hint, accent }) => (
        <article
          key={key}
          className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-[0_6px_24px_rgba(23,33,27,0.05)] transition-shadow hover:shadow-[0_10px_30px_rgba(23,33,27,0.08)] sm:rounded-2xl sm:p-4"
        >
          <div
            className={cn(
              "mb-2 inline-flex size-8 items-center justify-center rounded-lg sm:mb-3 sm:size-10 sm:rounded-xl",
              accent,
            )}
          >
            <Icon className="size-4 sm:size-[18px]" aria-hidden />
          </div>
          <p className="text-xl font-bold tracking-tight text-[#17211B] sm:text-2xl">
            {data[key]}
          </p>
          <p className="mt-0.5 text-xs font-medium text-[#17211B] sm:text-sm">
            <span className="sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{label}</span>
          </p>
          <p className="mt-0.5 hidden text-xs text-[#737B74] sm:mt-1 sm:block">
            {hint}
          </p>
        </article>
      ))}

      <article className="col-span-2 min-w-0 rounded-xl border border-[#15803D]/20 bg-gradient-to-br from-[#15803D] to-[#16A34A] p-3 text-white shadow-[0_12px_32px_rgba(21,128,61,0.35)] sm:rounded-2xl sm:p-4 lg:col-span-2">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 sm:size-10 sm:rounded-xl">
            <IndianRupee className="size-4 sm:size-[18px]" aria-hidden />
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
            <TrendingUp className="size-3" />
            +12%
          </span>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight sm:mt-4 sm:text-3xl">
          ₹{data.todayEarningsInr}
        </p>
        <p className="mt-1 text-xs font-medium text-white/90 sm:text-sm">
          Today&apos;s earnings
        </p>
        <p className="mt-1 text-[10px] text-white/75 sm:mt-2 sm:text-xs">
          Demo preview · mock data
        </p>
      </article>
    </section>
  );
}