"use client";

import Link from "next/link";
import { Bell, Menu, PanelLeftClose, PanelLeftOpen, User } from "lucide-react";

import { AppLogoImage } from "@/components/branding/app-logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/components/auth-provider";
import { cn } from "@/lib/utils";

import { useDashboardUI } from "../context/dashboard-ui-context";
import { useMerchantStoreLabel } from "../hooks/use-merchant-store-label";

type DashboardHeaderProps = {
  variant?: "desktop" | "mobile";
};

export function DashboardHeader({ variant = "desktop" }: DashboardHeaderProps) {
  const { partner } = useAuth();
  const merchantStoreName = useMerchantStoreLabel();
  const {
    sidebarCollapsed,
    toggleSidebarCollapsed,
    setMobileDrawerOpen,
    setNotificationsOpen,
  } = useDashboardUI();

  const displayName = partner?.fullName?.split(" ")[0] ?? "Rahul";
  const initial = displayName.charAt(0).toUpperCase();

  if (variant === "mobile") {
    return (
      <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-[#17211B] hover:bg-[#F0FDF4]"
            aria-label="Open menu"
            onClick={() => setMobileDrawerOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <AppLogoImage size={28} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#17211B]">
                GroceryBox
              </p>
              <p className="truncate text-[11px] text-[#737B74]">
                Delivery Partner
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-xl text-[#17211B] hover:bg-[#F0FDF4]"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-[#16A34A]" />
            </button>
            <Link
              href="/profile"
              className="flex size-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-sm font-semibold text-[#15803D]"
              aria-label="Open profile"
            >
              {initial}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 hidden border-b border-[#E5E7EB] bg-white lg:block">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl border-[#E5E7EB]"
            onClick={toggleSidebarCollapsed}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
          <div>
            <p className="text-sm font-medium text-[#17211B]">
              Good morning, {displayName} 👋
            </p>
            <p className="text-xs text-[#737B74]">
              Working with {merchantStoreName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative rounded-xl border-[#E5E7EB]"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="size-4" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-[#16A34A]" />
          </Button>
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F0FDF4]/60 px-3 py-1.5",
            )}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#15803D] shadow-sm">
              {initial}
            </span>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-[#17211B]">
                {partner?.fullName ?? "Rahul Kumar"}
              </p>
              <p className="text-xs text-[#737B74]">{merchantStoreName}</p>
            </div>
            <User className="size-4 text-[#737B74] sm:hidden" aria-hidden />
          </div>
        </div>
      </div>
    </header>
  );
}