import type { Metadata } from "next";
import { Package } from "lucide-react";

import { DashboardPlaceholderPage } from "@/features/dashboard/components/dashboard-placeholder-page";

export const metadata: Metadata = {
  title: "My Deliveries",
};

export default function DeliveriesPage() {
  return (
    <DashboardPlaceholderPage
      title="My Deliveries"
      description="Track assigned, in-progress, and upcoming deliveries from one place."
      icon={Package}
    />
  );
}