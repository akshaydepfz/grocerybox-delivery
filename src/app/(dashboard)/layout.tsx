import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AuthRouteGate } from "@/features/auth/components/auth-route-gate";

export default function DashboardRouteGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthRouteGate>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthRouteGate>
  );
}