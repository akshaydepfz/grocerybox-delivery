import { MapPin, Package } from "lucide-react";

export function DeliveryHomeScreen() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gb-text-primary">
          Today&apos;s deliveries
        </h1>
        <p className="text-sm text-gb-text-secondary">
          Order assignment and live tracking will appear here once delivery API
          routes are connected.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <PlaceholderCard
          icon={Package}
          title="Assigned orders"
          detail="No active assignments"
        />
        <PlaceholderCard
          icon={MapPin}
          title="Routes"
          detail="Navigation and stops coming soon"
        />
      </div>
    </div>
  );
}

function PlaceholderCard({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Package;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eceef2] bg-white p-6 shadow-[0_8px_30px_rgb(0_0_0_/0.04)]">
      <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-gb-onboard-feature-emerald text-gb-secondary">
        <Icon className="size-5" aria-hidden />
      </div>
      <h2 className="text-base font-semibold text-gb-text-primary">{title}</h2>
      <p className="mt-1 text-sm text-gb-text-secondary">{detail}</p>
    </div>
  );
}