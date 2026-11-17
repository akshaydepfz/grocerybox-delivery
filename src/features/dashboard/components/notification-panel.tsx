"use client";

import { Bell, Package, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useDashboardUI } from "../context/dashboard-ui-context";

export function NotificationPanel() {
  const { notificationsOpen, setNotificationsOpen } = useDashboardUI();

  if (!notificationsOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-[#17211B]/30"
        aria-label="Close notifications"
        onClick={() => setNotificationsOpen(false)}
      />
      <div
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-[#16A34A]" />
            <h2 className="text-base font-semibold text-[#17211B]">Notifications</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => setNotificationsOpen(false)}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#F0FDF4] text-[#16A34A]">
            <Package className="size-5" aria-hidden />
          </span>
          <p className="text-sm font-medium text-[#17211B]">No notifications yet</p>
          <p className="max-w-xs text-xs text-[#737B74]">
            New assignments from your store will appear here when we enable push alerts.
          </p>
        </div>
      </div>
    </div>
  );
}