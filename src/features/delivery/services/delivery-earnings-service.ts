import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { createApiClient } from "@/lib/api/client";
import { envelopeErrorMessage, parseApiEnvelope } from "@/lib/api/envelope";
import { ApiError } from "@/lib/api/types";

import type { EarningsPeriod, PaginatedDeliveryEarnings } from "../types/earnings";
import { paginatedDeliveryEarningsFromJson } from "../utils/parse-delivery-earnings";

const deliveryApiClient = createApiClient({ baseURL: "" });

function assertDataObject(data: unknown, status: number): Record<string, unknown> {
  const envelope = parseApiEnvelope(data);
  if (!envelope.success || typeof envelope.data !== "object" || !envelope.data) {
    throw new ApiError(envelopeErrorMessage(status, envelope), status);
  }
  return envelope.data as Record<string, unknown>;
}

export type FetchDeliveryEarningsParams = {
  period?: EarningsPeriod;
  page?: number;
  limit?: number;
};

export async function fetchDeliveryEarnings(
  params: FetchDeliveryEarningsParams = {},
): Promise<PaginatedDeliveryEarnings> {
  const response = await deliveryApiClient.get(API_ENDPOINTS.deliveryEarnings, {
    params: {
      period: params.period ?? "month",
      page: params.page ?? 1,
      limit: params.limit ?? 30,
    },
  });
  const data = assertDataObject(response.data, response.status);
  return paginatedDeliveryEarningsFromJson(data);
}