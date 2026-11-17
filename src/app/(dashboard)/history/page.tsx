import type { Metadata } from "next";
import { Clock } from "lucide-react";

import { DashboardPlaceholderPage } from "@/features/dashboard/components/dashboard-placeholder-page";

export const metadata: Metadata = {
  title: "Delivery History",
};

export default function HistoryPage() {
  return (
    <DashboardPlaceholderPage
      title="Delivery History"
      description="Review completed deliveries, timestamps, and commissions."
      icon={Clock}
    />
  );
}