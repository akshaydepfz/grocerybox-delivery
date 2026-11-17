"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/components/auth-provider";
import { ApiError } from "@/lib/api/types";

import type { DeliveryCompleteOrderInput, DeliveryOrderStep } from "../types/order";
import {
  completeDeliveryOrder,
  fetchDeliveryOrder,
  fetchDeliveryOrders,
  fetchDeliveryPerformanceSummary,
} from "../services/delivery-orders-service";

const deliveryOrdersKey = ["delivery", "orders"] as const;
const deliveryPerformanceKey = ["delivery", "performance"] as const;

export function useDeliveryApiEnabled(): boolean {
  const { isAuthReady, partner } = useAuth();
  return isAuthReady && Boolean(partner);
}

export function formatDeliveryQueryError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Session expired. Sign in again.";
    }
    if (error.status === 503) {
      return error.message || "Delivery APIs are unavailable. Run backend migration 000031 and restart the API.";
    }
    if (error.status === 404) {
      return "Delivery order API not found. Update and restart the Go backend (delivery routes).";
    }
    return error.message || "Could not load deliveries.";
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Could not load deliveries. Check your connection and API URL.";
}

export function useDeliveryOrders(currentStep?: DeliveryOrderStep) {
  const enabled = useDeliveryApiEnabled();
  return useQuery({
    queryKey: [...deliveryOrdersKey, currentStep ?? "all"],
    queryFn: () => fetchDeliveryOrders({ currentStep, limit: 20 }),
    enabled,
  });
}

export function useDeliveryOrder(orderId: string | null) {
  const enabled = useDeliveryApiEnabled();
  return useQuery({
    queryKey: [...deliveryOrdersKey, "detail", orderId],
    queryFn: () => fetchDeliveryOrder(orderId!),
    enabled: enabled && Boolean(orderId),
  });
}

export function useDeliveryPerformanceSummary() {
  const enabled = useDeliveryApiEnabled();
  return useQuery({
    queryKey: deliveryPerformanceKey,
    queryFn: fetchDeliveryPerformanceSummary,
    enabled,
  });
}

export function useCompleteDeliveryOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      input,
    }: {
      orderId: string;
      input: DeliveryCompleteOrderInput;
    }) => completeDeliveryOrder(orderId, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: deliveryOrdersKey }),
        queryClient.invalidateQueries({ queryKey: deliveryPerformanceKey }),
      ]);
    },
  });
}