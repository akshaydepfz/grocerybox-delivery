import type { DeliveryPartnerAppProfile } from "../types/profile";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function deliveryProfileFromJson(
  raw: Record<string, unknown>,
): DeliveryPartnerAppProfile {
  const commissionTypeRaw = readString(raw.commission_type);
  const commissionType =
    commissionTypeRaw === "percentage" ? "percentage" : "fixed";

  return {
    id: readString(raw.id),
    merchantId: readString(raw.merchant_id),
    merchantStoreName: readString(raw.merchant_store_name),
    fullName: readString(raw.full_name),
    phone: readString(raw.phone),
    commissionType,
    commissionValue: readNumber(raw.commission_value),
    completedDeliveries: Math.round(readNumber(raw.completed_deliveries)),
    isActive: raw.is_active === true,
    joinedAt: readString(raw.joined_at),
    lifetimeEarningsInr: readNumber(raw.lifetime_earnings_inr),
  };
}

export function formatProfileDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatCommissionLabel(profile: DeliveryPartnerAppProfile): string {
  if (profile.commissionType === "percentage") {
    return `${profile.commissionValue}% per order`;
  }
  return `₹${Math.round(profile.commissionValue)} per delivery`;
}