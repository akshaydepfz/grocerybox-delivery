import { CheckCircle2, Clock3, IndianRupee, Package } from "lucide-react";

import type { PerformanceSnapshot } from "../types/dashboard";

type PerformanceCardsProps = {
  data: PerformanceSnapshot;
};

const cards = [
  { key: "todayDeliveries" as const, label: "Today's Deliveries", icon: Package },
  { key: "completed" as const, label: "Completed", icon: CheckCircle2 },
  { key: "pending" as const, label: "Pending", icon: Clock3 },
  { key: "todayEarningsInr" as const, label: "Today's Earnings", icon: IndianRupee },
];

export function PerformanceCards({ data }: PerformanceCardsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map(({ key, label, icon: Icon }) => {
        const raw = data[key];
        const value =
          key === "todayEarningsInr" ? `₹${raw}` : String(raw);
        return (
          <div
            key={key}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_4px_20px_rgba(23,33,27,0.04)]"
          >
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
              <Icon className="size-4" aria-hidden />
            </div>
            <p className="text-2xl font-semibold tracking-tight text-[#17211B]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[#737B74]">{label}</p>
          </div>
        );
      })}
    </section>
  );
}