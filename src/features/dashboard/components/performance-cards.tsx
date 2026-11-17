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
    icon: Package,
    hint: "Assigned today",
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "completed" as const,
    label: "Completed",
    icon: CheckCircle2,
    hint: "Successfully delivered",
    accent: "bg-green-50 text-green-700",
  },
  {
    key: "pending" as const,
    label: "Pending",
    icon: Clock3,
    hint: "Still in progress",
    accent: "bg-amber-50 text-amber-700",
  },
];

export function PerformanceCards({ data }: PerformanceCardsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {statCards.map(({ key, label, icon: Icon, hint, accent }) => (
        <article
          key={key}
          className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_24px_rgba(23,33,27,0.05)] transition-shadow hover:shadow-[0_10px_30px_rgba(23,33,27,0.08)]"
        >
          <div
            className={cn(
              "mb-3 inline-flex size-10 items-center justify-center rounded-xl",
              accent,
            )}
          >
            <Icon className="size-[18px]" aria-hidden />
          </div>
          <p className="text-2xl font-bold tracking-tight text-[#17211B]">
            {data[key]}
          </p>
          <p className="mt-0.5 text-sm font-medium text-[#17211B]">{label}</p>
          <p className="mt-1 text-xs text-[#737B74]">{hint}</p>
        </article>
      ))}

      <article className="col-span-2 rounded-2xl border border-[#15803D]/20 bg-gradient-to-br from-[#15803D] to-[#16A34A] p-4 text-white shadow-[0_12px_32px_rgba(21,128,61,0.35)] lg:col-span-1">
        <div className="flex items-start justify-between">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15">
            <IndianRupee className="size-[18px]" aria-hidden />
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
            <TrendingUp className="size-3" />
            +12%
          </span>
        </div>
        <p className="mt-4 text-3xl font-bold tracking-tight">
          ₹{data.todayEarningsInr}
        </p>
        <p className="mt-1 text-sm font-medium text-white/90">
          Today&apos;s earnings
        </p>
        <p className="mt-2 text-xs text-white/75">Demo preview · mock data</p>
      </article>
    </section>
  );
}