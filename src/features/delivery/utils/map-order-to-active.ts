import type { ActiveDelivery } from "@/features/dashboard/types/dashboard";

import type { DeliveryOrderDetail, DeliveryOrderListItem } from "../types/order";
import { formatAddressSummary } from "./parse-delivery-order";

export function orderListItemToActiveDelivery(
  order: DeliveryOrderListItem,
  pickupLabel: string,
): ActiveDelivery {
  return {
    id: order.orderNumber || order.id,
    merchantName: order.merchantStoreName,
    customerName: order.customerName || "Customer",
    customerPhone: order.customerPhone,
    pickup: pickupLabel,
    dropoff: order.addressSummary,
    distanceKm: 0,
    etaMinutes: 0,
    status:
      order.currentStep === "delivered"
        ? "delivered"
        : order.currentStep === "out_for_delivery"
          ? "out_for_delivery"
          : "assigned",
  };
}

export function orderDetailToActiveDelivery(
  order: DeliveryOrderDetail,
  pickupLabel: string,
): ActiveDelivery {
  return orderListItemToActiveDelivery(order, pickupLabel);
}

export function buildPickupLabel(storeName: string, hub?: string): string {
  const hubTrimmed = hub?.trim();
  if (hubTrimmed) {
    return hubTrimmed;
  }
  return storeName;
}

export function formatDropoff(order: DeliveryOrderListItem | DeliveryOrderDetail): string {
  if ("address" in order && order.address) {
    return formatAddressSummary(order.address);
  }
  return order.addressSummary;
}