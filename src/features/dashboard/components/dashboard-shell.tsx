"use client";

import type { ReactNode } from "react";

import { DashboardUIProvider } from "../context/dashboard-ui-context";

import { DashboardHeader } from "./dashboard-header";
import { DeliverySidebar } from "./delivery-sidebar";
import { MobileBottomNavigation } from "./mobile-bottom-navigation";
import { MobileNavigationDrawer } from "./mobile-navigation-drawer";
import { NotificationPanel } from "./notification-panel";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <DashboardUIProvider>
      <div className="min-h-dvh bg-[#F8FAF9] text-[#17211B]">
        <div className="flex min-h-dvh">
          <DeliverySidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardHeader variant="mobile" />
            <DashboardHeader variant="desktop" />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 pb-24 lg:px-6 lg:py-6 lg:pb-8">
              {children}
            </main>
          </div>
        </div>
        <MobileBottomNavigation />
        <MobileNavigationDrawer />
        <NotificationPanel />
      </div>
    </DashboardUIProvider>
  );
}