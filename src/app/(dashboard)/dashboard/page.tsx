import type { Metadata } from "next";

import { DeliveryHomeScreen } from "@/features/dashboard/components/delivery-home-screen";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Delivery assignments and route overview",
};

export default function DashboardPage() {
  return <DeliveryHomeScreen />;
}