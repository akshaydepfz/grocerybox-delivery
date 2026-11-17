import type { Metadata } from "next";

import { EarningsScreen } from "@/features/dashboard/components/earnings-screen";

export const metadata: Metadata = {
  title: "Earnings",
};

export default function EarningsPage() {
  return <EarningsScreen />;
}