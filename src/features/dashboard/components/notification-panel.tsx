"use client";

import { Bell, Package, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useDashboardUI } from "../context/dashboard-ui-context";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "New delivery request",
    body: "Order #GB10246 is waiting for your response.",
    time: "2 min ago",
  },
  {
    id: "2",
    title: "Payout update",
    body: "Today's earnings summary is ready to review.",
    time: "1 hr ago",
  },
];

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
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {MOCK_NOTIFICATIONS.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4"
            >
              <div className="mb-2 flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
                  <Package className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#17211B]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-[#737B74]">{item.body}</p>
                  <p className="mt-2 text-xs text-[#737B74]">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-[#737B74]">
            Demo notifications — not connected to a live backend.
          </p>
        </div>
      </div>
    </div>
  );
}