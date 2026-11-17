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
    weekday: "short",
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
    <section className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-[#d1fae5] bg-gradient-to-br from-[#15803D] via-[#16A34A] to-[#22c55e] p-4 text-white shadow-[0_20px_50px_rgba(22,163,74,0.28)] sm:rounded-3xl sm:p-5 md:p-6">
      <div
        className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-[#bef264]/20 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between">
        <div className="min-w-0 flex-1">
          <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm sm:text-[11px]">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{formatTodayDate()}</span>
          </div>
          <h1 className="mt-2.5 text-xl font-semibold tracking-tight sm:mt-3 sm:text-2xl md:text-[1.65rem]">
            {greeting}, {firstName}
            <span className="ml-1" aria-hidden>
              👋
            </span>
          </h1>
          <p className="mt-1 text-sm text-white/85">Ready to deliver today?</p>

          <div className="mt-3 flex w-full min-w-0 items-center gap-2 rounded-xl bg-white/12 px-2.5 py-2 backdrop-blur-sm sm:mt-4 sm:max-w-full sm:rounded-2xl sm:px-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#15803D] shadow-sm sm:size-8 sm:rounded-xl">
              <Store className="size-3.5 sm:size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] text-white/70 sm:text-xs">
                Partnering with
              </p>
              <p className="truncate text-xs font-semibold sm:text-sm">{storeName}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center gap-3 min-[380px]:flex-col min-[380px]:items-center min-[380px]:gap-2">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#15803D] shadow-lg sm:size-14 sm:rounded-2xl sm:text-xl">
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
                "size-1.5 shrink-0 rounded-full",
                online ? "animate-pulse bg-[#16A34A]" : "bg-white/70",
              )}
            />
            {online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="relative mt-4 grid min-w-0 grid-cols-3 gap-1.5 border-t border-white/20 pt-3.5 sm:mt-5 sm:gap-2 sm:pt-4 md:gap-3">
        <HeroStat label="Today" value={String(performance.todayDeliveries)} />
        <HeroStat label="Done" value={String(performance.completed)} fullLabel="Completed" />
        <HeroStat
          label="Earn"
          fullLabel="Earnings"
          value={`₹${performance.todayEarningsInr}`}
          highlight
        />
      </div>
    </section>
  );
}

function HeroStat({
  label,
  fullLabel,
  value,
  highlight,
}: {
  label: string;
  fullLabel?: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl px-1.5 py-1.5 text-center sm:rounded-2xl sm:px-2.5 sm:py-2 md:px-3",
        highlight ? "bg-white/18 backdrop-blur-sm" : "bg-white/10",
      )}
    >
      <p className="truncate text-[9px] font-medium uppercase tracking-wide text-white/75 sm:text-[10px] md:text-[11px]">
        <span className="md:hidden">{label}</span>
        {fullLabel ? (
          <span className="hidden md:inline">{fullLabel}</span>
        ) : (
          <span className="hidden md:inline">{label}</span>
        )}
      </p>
      <p
        className={cn(
          "mt-0.5 flex min-w-0 items-center justify-center gap-0.5 font-bold sm:gap-1",
          highlight
            ? "text-sm sm:text-base md:text-lg"
            : "text-sm sm:text-base md:text-lg",
        )}
      >
        {highlight ? (
          <TrendingUp className="size-3 shrink-0 opacity-90 sm:size-3.5" />
        ) : null}
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}