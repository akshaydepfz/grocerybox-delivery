"use client";

import { Store } from "lucide-react";
import { useMemo, useState } from "react";

import { useAuth } from "@/features/auth/components/auth-provider";

import {
  MOCK_ACTIVE_DELIVERY,
  MOCK_MERCHANT_NAME,
  MOCK_NEW_DELIVERIES,
  MOCK_PERFORMANCE,
  MOCK_RECENT_ACTIVITY,
} from "../data/mock-dashboard";

import { ActiveDeliveryCard } from "./active-delivery-card";
import { AvailabilityCard } from "./availability-card";
import { DeliveryDetailPanel } from "./delivery-detail-panel";
import { NewDeliveryCard } from "./new-delivery-card";
import { PerformanceCards } from "./performance-cards";
import { RecentActivity } from "./recent-activity";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

export function DeliveryHomeScreen() {
  const { partner } = useAuth();
  const [online, setOnline] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newRequests, setNewRequests] = useState(MOCK_NEW_DELIVERIES);

  const firstName = useMemo(() => {
    const name = partner?.fullName ?? "Rahul";
    return name.split(" ")[0] ?? name;
  }, [partner?.fullName]);

  return (
    <div className="space-y-6 pb-2">
      <section>
        <h1 className="text-xl font-semibold text-[#17211B] lg:text-2xl">
          {greeting()}, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-[#737B74]">Ready to deliver today?</p>
        <MerchantAssociationPill />
      </section>

      <AvailabilityCard online={online} onOnlineChange={setOnline} />

      <div>
        <h2 className="mb-3 text-base font-semibold text-[#17211B]">
          Today&apos;s performance
        </h2>
        <PerformanceCards data={MOCK_PERFORMANCE} />
      </div>

      <ActiveDeliveryCard
        delivery={MOCK_ACTIVE_DELIVERY}
        onViewDetails={() => setDetailOpen(true)}
      />

      <section>
        <h2 className="mb-3 text-base font-semibold text-[#17211B]">
          New Deliveries
        </h2>
        {newRequests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white px-4 py-8 text-center text-sm text-[#737B74]">
            No pending requests right now.
          </p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {newRequests.map((request) => (
              <NewDeliveryCard
                key={request.id}
                request={request}
                onAccept={() =>
                  setNewRequests((items) =>
                    items.filter((item) => item.id !== request.id),
                  )
                }
                onDecline={() =>
                  setNewRequests((items) =>
                    items.filter((item) => item.id !== request.id),
                  )
                }
              />
            ))}
          </div>
        )}
      </section>

      <RecentActivity items={MOCK_RECENT_ACTIVITY} />

      <DeliveryDetailPanel
        delivery={detailOpen ? MOCK_ACTIVE_DELIVERY : null}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}

function MerchantAssociationPill() {
  return (
    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs text-[#737B74] shadow-sm">
      <span className="flex size-7 items-center justify-center rounded-full bg-[#F0FDF4] text-[#16A34A]">
        <Store className="size-3.5" aria-hidden />
      </span>
      Working with {MOCK_MERCHANT_NAME}
    </div>
  );
}