import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { RecentDeliveryActivity } from "../types/dashboard";

type RecentActivityProps = {
  items: RecentDeliveryActivity[];
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_rgba(23,33,27,0.04)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-[#17211B]">Recent Activity</h2>
        <Link
          href="/history"
          className="inline-flex items-center gap-0.5 text-sm font-medium text-[#16A34A] hover:text-[#15803D]"
        >
          View All
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#F3F4F6] bg-[#FAFAFA] px-3 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#17211B]">#{item.id}</p>
              <p className="truncate text-xs text-[#737B74]">
                {item.customerName} · {item.completedAt}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#15803D]">
                ₹{item.commissionInr}
              </p>
              <p className="text-[11px] font-medium text-[#16A34A]">Delivered</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}