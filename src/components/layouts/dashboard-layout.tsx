import type { ReactNode } from "react";

import { DeliveryShell } from "@/features/dashboard/components/delivery-shell";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DeliveryShell>{children}</DeliveryShell>;
}