import type { DeliveryPartnerProfile } from "../types/delivery-partner";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function deliveryPartnerFromJson(
  raw: Record<string, unknown>,
): DeliveryPartnerProfile {
  const id = readString(raw.id);
  const merchantId = readString(raw.merchant_id);
  const fullName = readString(raw.full_name);
  const phone = readString(raw.phone);
  if (!id || !merchantId || !fullName || !phone) {
    throw new Error("Invalid delivery partner profile in response.");
  }
  return { id, merchantId, fullName, phone };
}