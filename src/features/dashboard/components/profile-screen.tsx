"use client";

import {
  BadgeCheck,
  Building2,
  IndianRupee,
  LogOut,
  Phone,
  Store,
  User,
} from "lucide-react";

import { GroceryAnimatedLoader } from "@/components/shared/animated-loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/components/auth-provider";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { signOutDeliveryPartner } from "@/features/auth/services/delivery-partner-login-service";
import { DeliveryApiErrorBanner } from "@/features/dashboard/components/delivery-api-error-banner";
import { useDeliveryProfile } from "@/features/delivery/hooks/use-delivery-orders";
import {
  formatCommissionLabel,
  formatProfileDate,
} from "@/features/delivery/utils/parse-delivery-profile";
import { cn } from "@/lib/utils";

export function ProfileScreen() {
  const { setPartner } = useAuth();
  const profileQuery = useDeliveryProfile();

  if (profileQuery.isLoading) {
    return <GroceryAnimatedLoader label="Loading profile" />;
  }

  const profile = profileQuery.data;

  const handleLogout = async () => {
    await signOutDeliveryPartner();
    setPartner(null);
    window.location.assign(AUTH_ROUTES.login);
  };

  if (profileQuery.error || !profile) {
    return (
      <div className="space-y-4">
        {profileQuery.error ? (
          <DeliveryApiErrorBanner
            error={profileQuery.error}
            onRetry={() => void profileQuery.refetch()}
          />
        ) : null}
        <ProfileFallbackCard onLogout={() => void handleLogout()} />
      </div>
    );
  }

  const initial = profile.fullName.charAt(0).toUpperCase();

  return (
    <div className="w-full min-w-0 space-y-4 pb-4">
      <section className="overflow-hidden rounded-2xl border border-[#d1fae5] bg-gradient-to-br from-[#15803D] to-[#16A34A] p-5 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-[#15803D] shadow-md">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight">
              {profile.fullName}
            </h1>
            <p className="mt-1 text-sm text-white/85">Delivery partner</p>
            <span
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                profile.isActive
                  ? "bg-white text-[#15803D]"
                  : "bg-black/20 text-white",
              )}
            >
              <BadgeCheck className="size-3" />
              {profile.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-[#17211B]">Account details</h2>
        <dl className="mt-3 space-y-3">
          <ProfileRow
            icon={Phone}
            label="Phone"
            value={profile.phone}
            href={buildTelHref(profile.phone)}
          />
          <ProfileRow
            icon={Store}
            label="Store"
            value={profile.merchantStoreName || "Your store"}
          />
          <ProfileRow
            icon={Building2}
            label="Partner ID"
            value={profile.id.slice(0, 8).toUpperCase()}
          />
          <ProfileRow
            icon={User}
            label="Joined"
            value={formatProfileDate(profile.joinedAt)}
          />
        </dl>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard
          label="Deliveries"
          value={String(profile.completedDeliveries)}
          hint="All time"
        />
        <StatCard
          label="Earnings"
          value={`₹${Math.round(profile.lifetimeEarningsInr ?? 0)}`}
          hint="Lifetime commission"
          icon={IndianRupee}
        />
      </section>

      <section className="rounded-2xl border border-[#F0FDF4] bg-[#F0FDF4]/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#15803D]">
          Commission
        </p>
        <p className="mt-1 text-base font-semibold text-[#17211B]">
          {formatCommissionLabel(profile)}
        </p>
        <p className="mt-1 text-xs text-[#737B74]">
          Set by your store owner in the merchant panel.
        </p>
      </section>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-xl border-[#E5E7EB] text-[#17211B]"
        onClick={() => void handleLogout()}
      >
        <LogOut className="size-4" />
        Sign out
      </Button>
    </div>
  );
}

function ProfileFallbackCard({ onLogout }: { onLogout: () => void }) {
  const { partner } = useAuth();
  if (!partner) {
    return null;
  }
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <p className="font-semibold text-[#17211B]">{partner.fullName}</p>
      <p className="mt-1 text-sm text-[#737B74]">{partner.phone}</p>
      <p className="mt-1 text-sm text-[#737B74]">{partner.merchantStoreName}</p>
      <Button
        type="button"
        variant="outline"
        className="mt-4 h-11 w-full rounded-xl"
        onClick={onLogout}
      >
        <LogOut className="size-4" />
        Sign out
      </Button>
    </section>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string | null;
}) {
  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-[#16A34A]">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-[11px] font-medium uppercase tracking-wide text-[#737B74]">
          {label}
        </dt>
        <dd className="truncate text-sm font-medium text-[#17211B]">{value}</dd>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex gap-3 rounded-xl border border-transparent p-1 transition-colors hover:border-[#E5E7EB] hover:bg-[#FAFAFA]"
      >
        {content}
      </a>
    );
  }

  return <div className="flex gap-3">{content}</div>;
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: typeof IndianRupee;
}) {
  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
      {Icon ? (
        <Icon className="mb-2 size-4 text-[#16A34A]" aria-hidden />
      ) : null}
      <p className="text-xl font-bold text-[#17211B]">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-[#17211B]">{label}</p>
      <p className="text-[11px] text-[#737B74]">{hint}</p>
    </article>
  );
}

function buildTelHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return null;
  }
  return `tel:+91${digits.slice(-10)}`;
}