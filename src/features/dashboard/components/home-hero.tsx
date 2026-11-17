"use client";

import { CalendarDays, Store, TrendingUp } from "lucide-react";

import { useAuth } from "@/features/auth/components/auth-provider";
import { cn } from "@/lib/utils";

import type { PerformanceSnapshot } from "../types/dashboard";

type HomeHeroProps = {
  greeting: string;
  firstName: string;
  storeName: string;
  online: boolean;
  performance: PerformanceSnapshot;
};

function formatTodayDate(): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date());
}

export function HomeHero({
  greeting,
  firstName,
  storeName,
  online,
  performance,
}: HomeHeroProps) {
  const { partner } = useAuth();
  const initial = (partner?.fullName ?? firstName).charAt(0).toUpperCase();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#d1fae5] bg-gradient-to-br from-[#15803D] via-[#16A34A] to-[#22c55e] p-5 text-white shadow-[0_20px_50px_rgba(22,163,74,0.28)] sm:p-6">
      <div
        className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-[#bef264]/20 blur-3xl"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
            <CalendarDays className="size-3.5" aria-hidden />
            {formatTodayDate()}
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-[1.65rem]">
            {greeting}, {firstName}
            <span className="ml-1" aria-hidden>
              👋
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-white/85">Ready to deliver today?</p>

          <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-2xl bg-white/12 px-3 py-2 backdrop-blur-sm">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#15803D] shadow-sm">
              <Store className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs text-white/70">Partnering with</p>
              <p className="truncate text-sm font-semibold">{storeName}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-[#15803D] shadow-lg">
            {initial}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              online ? "bg-white text-[#15803D]" : "bg-black/20 text-white/90",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                online ? "animate-pulse bg-[#16A34A]" : "bg-white/70",
              )}
            />
            {online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-white/20 pt-4 sm:gap-3">
        <HeroStat label="Today" value={String(performance.todayDeliveries)} />
        <HeroStat label="Completed" value={String(performance.completed)} />
        <HeroStat
          label="Earnings"
          value={`₹${performance.todayEarningsInr}`}
          highlight
        />
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl px-2.5 py-2 text-center sm:px-3",
        highlight ? "bg-white/18 backdrop-blur-sm" : "bg-white/10",
      )}
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-white/75 sm:text-[11px]">
        {label}
      </p>
      <p className="mt-0.5 flex items-center justify-center gap-1 text-base font-bold sm:text-lg">
        {highlight ? <TrendingUp className="size-3.5 opacity-90" /> : null}
        {value}
      </p>
    </div>
  );
}