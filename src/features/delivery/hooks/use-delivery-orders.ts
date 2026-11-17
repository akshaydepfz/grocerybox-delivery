"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { DeliveryCompleteOrderInput, DeliveryOrderStep } from "../types/order";
import {
  completeDeliveryOrder,
  fetchDeliveryOrder,
  fetchDeliveryOrders,
  fetchDeliveryPerformanceSummary,
} from "../services/delivery-orders-service";

const deliveryOrdersKey = ["delivery", "orders"] as const;
const deliveryPerformanceKey = ["delivery", "performance"] as const;

export function useDeliveryOrders(currentStep?: DeliveryOrderStep) {
  return useQuery({
    queryKey: [...deliveryOrdersKey, currentStep ?? "all"],
    queryFn: () => fetchDeliveryOrders({ currentStep, limit: 20 }),
  });
}

export function useDeliveryOrder(orderId: string | null) {
  return useQuery({
    queryKey: [...deliveryOrdersKey, "detail", orderId],
    queryFn: () => fetchDeliveryOrder(orderId!),
    enabled: Boolean(orderId),
  });
}

export function useDeliveryPerformanceSummary() {
  return useQuery({
    queryKey: deliveryPerformanceKey,
    queryFn: fetchDeliveryPerformanceSummary,
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