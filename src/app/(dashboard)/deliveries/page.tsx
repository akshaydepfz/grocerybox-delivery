import type { Metadata } from "next";

import { DeliveriesScreen } from "@/features/dashboard/components/deliveries-screen";

export const metadata: Metadata = {
  title: "My Deliveries",
};

export default function DeliveriesPage() {
  return <DeliveriesScreen />;
}