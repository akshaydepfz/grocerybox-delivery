import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

import type { RecentDeliveryActivity } from "../types/dashboard";

type RecentActivityProps = {
  items: RecentDeliveryActivity[];
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_28px_rgba(23,33,27,0.06)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#F3F4F6] bg-gradient-to-r from-[#FAFAFA] to-white px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-[#17211B]">Recent activity</h2>
          <p className="text-xs text-[#737B74]">Latest completed runs</p>
        </div>
        <Link
          href="/history"
          className="inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-sm font-medium text-[#16A34A] transition-colors hover:bg-[#F0FDF4] hover:text-[#15803D]"
        >
          View all
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <ul className="divide-y divide-[#F3F4F6] p-2">
        {items.map((item) => (
          <li key={item.id}>
            <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#FAFAFA]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
                <CheckCircle2 className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#17211B]">#{item.id}</p>
                <p className="truncate text-xs text-[#737B74]">
                  {item.customerName} · {item.completedAt}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#15803D]">₹{item.commissionInr}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#16A34A]">
                  Delivered
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}