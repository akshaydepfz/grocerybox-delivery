import { API_ENDPOINTS, deliveryOrderPath } from "@/lib/api/endpoints";
import { createApiClient } from "@/lib/api/client";
import { envelopeErrorMessage, parseApiEnvelope } from "@/lib/api/envelope";
import { ApiError } from "@/lib/api/types";

import type {
  DeliveryCompleteOrderInput,
  DeliveryCompleteOrderResult,
  DeliveryOrderDetail,
  DeliveryOrderStep,
  DeliveryPerformanceSummary,
  PaginatedDeliveryOrders,
} from "../types/order";
import {
  deliveryOrderDetailFromJson,
  deliveryOrderListItemFromJson,
  deliveryPerformanceFromJson,
} from "../utils/parse-delivery-order";

const deliveryApiClient = createApiClient({ baseURL: "" });

function assertDataObject(data: unknown, status: number): Record<string, unknown> {
  const envelope = parseApiEnvelope(data);
  if (!envelope.success || typeof envelope.data !== "object" || !envelope.data) {
    throw new ApiError(envelopeErrorMessage(status, envelope), status);
  }
  return envelope.data as Record<string, unknown>;
}

export type ListDeliveryOrdersParams = {
  page?: number;
  limit?: number;
  currentStep?: DeliveryOrderStep;
};

export async function fetchDeliveryOrders(
  params: ListDeliveryOrdersParams = {},
): Promise<PaginatedDeliveryOrders> {
  const response = await deliveryApiClient.get(API_ENDPOINTS.deliveryOrders, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      ...(params.currentStep ? { current_step: params.currentStep } : {}),
    },
  });
  const data = assertDataObject(response.data, response.status);
  const itemsRaw = Array.isArray(data.items) ? data.items : [];
  const paginationRaw =
    data.pagination && typeof data.pagination === "object"
      ? (data.pagination as Record<string, unknown>)
      : {};

  return {
    items: itemsRaw.map((item) =>
      deliveryOrderListItemFromJson(
        item && typeof item === "object" ? (item as Record<string, unknown>) : {},
      ),
    ),
    pagination: {
      page: Number(paginationRaw.page) || 1,
      limit: Number(paginationRaw.limit) || 20,
      total: Number(paginationRaw.total) || 0,
      totalPages:
        Number(paginationRaw.total_pages ?? paginationRaw.totalPages) || 0,
    },
  };
}

export async function fetchDeliveryOrder(orderId: string): Promise<DeliveryOrderDetail> {
  const response = await deliveryApiClient.get(deliveryOrderPath(orderId));
  const data = assertDataObject(response.data, response.status);
  return deliveryOrderDetailFromJson(data);
}

export async function fetchDeliveryPerformanceSummary(): Promise<DeliveryPerformanceSummary> {
  const response = await deliveryApiClient.get(API_ENDPOINTS.deliveryPerformanceSummary);
  const data = assertDataObject(response.data, response.status);
  return deliveryPerformanceFromJson(data);
}

export async function completeDeliveryOrder(
  orderId: string,
  input: DeliveryCompleteOrderInput,
): Promise<DeliveryCompleteOrderResult> {
  const response = await deliveryApiClient.post(
    `${deliveryOrderPath(orderId)}/complete`,
    { collection_mode: input.collectionMode },
  );
  const data = assertDataObject(response.data, response.status);
  const orderRaw = data.order;
  if (!orderRaw || typeof orderRaw !== "object") {
    throw new ApiError("Unexpected complete delivery response.", response.status);
  }
  const modeRaw = data.collection_mode;
  const collectionMode =
    modeRaw === "cash" || modeRaw === "online" ? modeRaw : input.collectionMode;

  return {
    order: deliveryOrderDetailFromJson(orderRaw as Record<string, unknown>),
    commissionAmountInr: Number(data.commission_amount_inr) || 0,
    collectionMode,
  };
}