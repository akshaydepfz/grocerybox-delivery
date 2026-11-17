"use client";

import { Inbox } from "lucide-react";
import { useMemo, useState } from "react";

import { useAuth } from "@/features/auth/components/auth-provider";

import {
  MOCK_ACTIVE_DELIVERY,
  MOCK_NEW_DELIVERIES,
  MOCK_PERFORMANCE,
  MOCK_RECENT_ACTIVITY,
} from "../data/mock-dashboard";
import { useMerchantStoreLabel } from "../hooks/use-merchant-store-label";

import { ActiveDeliveryCard } from "./active-delivery-card";
import { AvailabilityCard } from "./availability-card";
import { DeliveryDetailPanel } from "./delivery-detail-panel";
import { HomeHero } from "./home-hero";
import { NewDeliveryCard } from "./new-delivery-card";
import { PerformanceCards } from "./performance-cards";
import { RecentActivity } from "./recent-activity";
import { SectionHeader } from "./section-header";

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
  const merchantStoreName = useMerchantStoreLabel();
  const [online, setOnline] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newRequests, setNewRequests] = useState(MOCK_NEW_DELIVERIES);

  const firstName = useMemo(() => {
    const name = partner?.fullName ?? "Rahul";
    return name.split(" ")[0] ?? name;
  }, [partner?.fullName]);

  const activeDelivery = useMemo(
    () => ({
      ...MOCK_ACTIVE_DELIVERY,
      merchantName: merchantStoreName,
      pickup: `${merchantStoreName}, Kozhikode`,
    }),
    [merchantStoreName],
  );

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 pb-4 sm:space-y-6">
      <HomeHero
        greeting={greeting()}
        firstName={firstName}
        storeName={merchantStoreName}
        online={online}
        performance={MOCK_PERFORMANCE}
      />

      <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-12 lg:items-start">
        <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-8">
          <AvailabilityCard online={online} onOnlineChange={setOnline} />

          <section>
            <SectionHeader
              title="Active delivery"
              description="Track your current order and progress"
            />
            <ActiveDeliveryCard
              delivery={activeDelivery}
              onViewDetails={() => setDetailOpen(true)}
            />
          </section>

          <section>
            <SectionHeader
              title="New requests"
              description={
                newRequests.length > 0
                  ? `${newRequests.length} waiting for your response`
                  : "You're all caught up"
              }
            />
            {newRequests.length === 0 ? (
              <EmptyRequests />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
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
        </div>

        <aside className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-4 lg:sticky lg:top-24">
          <section>
            <SectionHeader
              title="Today's numbers"
              description="Quick performance overview"
            />
            <PerformanceCards data={MOCK_PERFORMANCE} />
          </section>

          <RecentActivity items={MOCK_RECENT_ACTIVITY} />
        </aside>
      </div>

      <DeliveryDetailPanel
        delivery={detailOpen ? activeDelivery : null}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}

function EmptyRequests() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D1D5DB] bg-gradient-to-b from-white to-[#FAFAFA] px-6 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#F0FDF4] text-[#16A34A]">
        <Inbox className="size-7" aria-hidden />
      </span>
      <p className="mt-4 text-base font-semibold text-[#17211B]">
        No new requests
      </p>
      <p className="mt-1 max-w-xs text-sm text-[#737B74]">
        Go online to start receiving delivery offers.
      </p>
    </div>
  );
}