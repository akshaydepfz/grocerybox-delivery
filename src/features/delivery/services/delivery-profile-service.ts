import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { createApiClient } from "@/lib/api/client";
import { envelopeErrorMessage, parseApiEnvelope } from "@/lib/api/envelope";
import { ApiError } from "@/lib/api/types";

import type { DeliveryPartnerAppProfile } from "../types/profile";
import { deliveryProfileFromJson } from "../utils/parse-delivery-profile";

const deliveryApiClient = createApiClient({ baseURL: "" });

export async function fetchDeliveryProfile(): Promise<DeliveryPartnerAppProfile> {
  const response = await deliveryApiClient.get(API_ENDPOINTS.deliveryProfile);
  const envelope = parseApiEnvelope(response.data);
  if (!envelope.success || typeof envelope.data !== "object" || !envelope.data) {
    throw new ApiError(envelopeErrorMessage(response.status, envelope), response.status);
  }
  return deliveryProfileFromJson(envelope.data as Record<string, unknown>);
}