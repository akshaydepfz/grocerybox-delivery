"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogoImage } from "@/components/branding/app-logo";
import { useAuth } from "@/features/auth/components/auth-provider";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { signOutDeliveryPartner } from "@/features/auth/services/delivery-partner-login-service";
import { cn } from "@/lib/utils";

import {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_SIDEBAR_EXTRA,
} from "../constants/nav-items";
import { useDashboardUI } from "../context/dashboard-ui-context";
import { useMerchantStoreLabel } from "../hooks/use-merchant-store-label";

export function DeliverySidebar() {
  const pathname = usePathname();
  const { partner, setPartner } = useAuth();
  const { sidebarCollapsed } = useDashboardUI();
  const merchantStoreName = useMerchantStoreLabel();

  const displayName = partner?.fullName ?? "Rahul Kumar";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOutDeliveryPartner();
    setPartner(null);
    window.location.assign(AUTH_ROUTES.login);
  };

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col border-r border-[#E5E7EB] bg-white transition-[width] duration-300 ease-out lg:flex",
        sidebarCollapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      <div className="border-b border-[#E5E7EB] px-4 py-5">
        <div
          className={cn(
            "flex items-center gap-3",
            sidebarCollapsed && "justify-center",
          )}
        >
          <AppLogoImage size={sidebarCollapsed ? 36 : 40} />
          {!sidebarCollapsed ? (
            <div>
              <p className="text-sm font-semibold text-[#17211B]">GroceryBox</p>
              <p className="text-[11px] font-medium tracking-wide text-[#16A34A] uppercase">
                Delivery Partner
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-b border-[#E5E7EB] px-4 py-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl bg-[#F0FDF4] p-3",
            sidebarCollapsed && "justify-center p-2",
          )}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#15803D] shadow-sm">
            {initial}
          </span>
          {!sidebarCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#17211B]">
                {displayName}
              </p>
              <p className="truncate text-xs text-[#737B74]">{merchantStoreName}</p>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#F0FDF4] text-[#15803D]"
                  : "text-[#737B74] hover:bg-[#FAFAFA] hover:text-[#17211B]",
                sidebarCollapsed && "justify-center px-2",
              )}
            >
              <Icon
                className={cn("size-5 shrink-0", active && "text-[#16A34A]")}
              />
              {!sidebarCollapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-[#E5E7EB] px-3 py-4">
        {DASHBOARD_SIDEBAR_EXTRA.map((item) => {
          const Icon = item.icon;
          if (item.id === "logout") {
            return (
              <button
                key={item.id}
                type="button"
                title={sidebarCollapsed ? item.label : undefined}
                onClick={() => void handleLogout()}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#737B74] transition-colors hover:bg-red-50 hover:text-red-700",
                  sidebarCollapsed && "justify-center px-2",
                )}
              >
                <Icon className="size-5 shrink-0" />
                {!sidebarCollapsed ? <span>{item.label}</span> : null}
              </button>
            );
          }
          return (
            <Link
              key={item.id}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#737B74] transition-colors hover:bg-[#FAFAFA] hover:text-[#17211B]",
                sidebarCollapsed && "justify-center px-2",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {!sidebarCollapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}