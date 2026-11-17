"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useEffect } from "react";

import { AppLogoImage } from "@/components/branding/app-logo";
import { useAuth } from "@/features/auth/components/auth-provider";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { signOutDeliveryPartner } from "@/features/auth/services/delivery-partner-login-service";
import { cn } from "@/lib/utils";

import {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_SIDEBAR_EXTRA,
} from "../constants/nav-items";
import { MOCK_MERCHANT_NAME } from "../data/mock-dashboard";
import { useDashboardUI } from "../context/dashboard-ui-context";

export function MobileNavigationDrawer() {
  const pathname = usePathname();
  const { partner, setPartner } = useAuth();
  const { mobileDrawerOpen, setMobileDrawerOpen } = useDashboardUI();

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname, setMobileDrawerOpen]);

  useEffect(() => {
    if (!mobileDrawerOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileDrawerOpen, setMobileDrawerOpen]);

  if (!mobileDrawerOpen) {
    return null;
  }

  const displayName = partner?.fullName ?? "Rahul Kumar";

  const handleLogout = async () => {
    await signOutDeliveryPartner();
    setPartner(null);
    window.location.assign(AUTH_ROUTES.login);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-[#17211B]/40 backdrop-blur-[2px]"
        aria-label="Close menu"
        onClick={() => setMobileDrawerOpen(false)}
      />
      <div className="absolute top-0 left-0 flex h-full w-[min(88vw,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
          <div className="flex items-center gap-2">
            <AppLogoImage size={32} />
            <p className="text-sm font-semibold text-[#17211B]">GroceryBox</p>
          </div>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl hover:bg-[#F0FDF4]"
            aria-label="Close navigation"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-[#E5E7EB] px-4 py-4">
          <p className="text-sm font-semibold text-[#17211B]">{displayName}</p>
          <p className="text-xs text-[#737B74]">{MOCK_MERCHANT_NAME}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                  active
                    ? "bg-[#F0FDF4] text-[#15803D]"
                    : "text-[#737B74]",
                )}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
          {DASHBOARD_SIDEBAR_EXTRA.map((item) => {
            const Icon = item.icon;
            if (item.id === "logout") {
              return (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600"
                  onClick={() => void handleLogout()}
                >
                  <Icon className="size-5" />
                  {item.label}
                </button>
              );
            }
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#737B74]"
                onClick={() => setMobileDrawerOpen(false)}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}