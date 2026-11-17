import type { DeliveryOrderAddress } from "../types/order";
import { formatAddressSummary } from "./parse-delivery-order";

export function resolveCustomerPhone(
  customerPhone: string,
  address?: Pick<DeliveryOrderAddress, "phone">,
): string {
  return customerPhone.trim() || address?.phone.trim() || "";
}

/** E.164-style href for Indian mobile numbers (`tel:+91…`). */
export function buildTelHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return null;
  }
  return `tel:+91${digits.slice(-10)}`;
}

export function buildGoogleMapsDirectionsUrl(
  address: DeliveryOrderAddress,
  addressSummary?: string,
): string {
  const { lat, lng } = address;
  if (
    lat != null &&
    lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  ) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  const query =
    addressSummary?.trim() || formatAddressSummary(address);
  if (!query) {
    return "https://www.google.com/maps";
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}