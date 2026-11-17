import type { Metadata } from "next";
import { IndianRupee } from "lucide-react";

import { DashboardPlaceholderPage } from "@/features/dashboard/components/dashboard-placeholder-page";

export const metadata: Metadata = {
  title: "Earnings",
};

export default function EarningsPage() {
  return (
    <DashboardPlaceholderPage
      title="Earnings"
      description="View daily payouts, commissions, and performance summaries."
      icon={IndianRupee}
    />
  );
}