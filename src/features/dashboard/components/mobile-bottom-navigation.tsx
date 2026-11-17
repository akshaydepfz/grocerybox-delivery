"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { MOBILE_BOTTOM_NAV } from "../constants/nav-items";

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5E7EB] bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
      aria-label="Primary"
    >
      <div
        className="mx-auto grid w-full max-w-3xl px-2 pt-1 pb-1"
        style={{
          gridTemplateColumns: `repeat(${MOBILE_BOTTOM_NAV.length}, minmax(0, 1fr))`,
        }}
      >
        {MOBILE_BOTTOM_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex min-h-[52px] w-full flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 text-[10px] font-medium transition-colors",
                active ? "text-[#16A34A]" : "text-[#737B74]",
              )}
            >
              <Icon className={cn("size-5", active && "text-[#16A34A]")} />
              <span className="truncate">{item.shortLabel ?? item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}